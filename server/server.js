const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = "secret123"; // for school project only

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// -------------------------
//  SCHEMAS & MODELS
// -------------------------
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const itemSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: String, // "Lost" | "Found"
    location: String,
    contact: String,
    image: String,
    returned: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

// -------------------------
//  MONGODB CONNECT + SEED
// -------------------------
mongoose
  .connect("mongodb://127.0.0.1/lostfound")
  .then(async () => {
    console.log("MongoDB Connected");
    await seedDefaultUsers();
  })
  .catch((err) => console.log(err));

async function seedDefaultUsers() {
  const adminExists = await User.findOne({ role: "admin" });
  if (!adminExists) {
    const hash = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@lostfound.com",
      passwordHash: hash,
      role: "admin",
    });
    console.log("Default admin created: admin@lostfound.com / admin123");
  }
}

// -------------------------
//  AUTH MIDDLEWARE
// -------------------------
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, name, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

// -------------------------
//  MULTER: FILE UPLOAD
// -------------------------
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// -------------------------
//  AUTH ROUTES
// -------------------------

// LOGIN (admin & user)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch)
    return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Get current user (optional; can be used later)
app.get("/api/auth/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});

// -------------------------
// ADMIN - USER CRUD ROUTES
// -------------------------

// GET all users
app.get("/api/users", auth, adminOnly, async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
});

// CREATE user
app.post("/api/users", auth, adminOnly, async (req, res) => {
  const { name, email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash: hash,
    role,
  });

  res.json(user);
});

// UPDATE user
app.put("/api/users/:id", auth, adminOnly, async (req, res) => {
  const { name, email, role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true }
  ).select("-passwordHash");

  res.json(user);
});

// DELETE user
app.delete("/api/users/:id", auth, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// -------------------------
// ADMIN DASHBOARD SUMMARY
// -------------------------
app.get("/api/dashboard", auth, adminOnly, async (req, res) => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("-passwordHash");

  const items = await Item.find()
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .limit(5);

  const total = await Item.countDocuments();
  const lost = await Item.countDocuments({ status: "Lost", returned: false });
  const found = await Item.countDocuments({ status: "Found", returned: false });
  const returned = await Item.countDocuments({ returned: true });

  res.json({
    recentUsers: users,
    recentItems: items,
    stats: {
      total,
      lost,
      found,
      returned,
    },
  });
});

// -------------------------
//  ITEM ROUTES
// -------------------------

// CREATE ITEM (must be logged in)
app.post("/api/items", auth, upload.single("image"), async (req, res) => {
  try {
    const item = new Item({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      location: req.body.location,
      contact: req.body.contact,
      image: req.file?.filename,
      userId: req.user.id,
    });

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL ITEMS (public)
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find()
      .populate("userId", "name") // ✅ Correct placement
      .sort({ createdAt: -1 }); // ✅ Sorting works normally

    res.json(items);
  } catch (err) {
    console.error("Error loading items:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// DELETE ITEM
app.delete("/api/items/:id", auth, async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) return res.status(404).json({ error: "Item not found" });

  // Allow if admin OR owner
  if (req.user.role !== "admin" && String(item.userId) !== req.user.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await Item.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// MARK RETURNED (admin or owner)
app.patch("/api/items/:id", auth, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  // allow admin OR owner
  if (String(item.userId) !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }

  item.returned = true;
  await item.save();

  res.json(item);
});

// GET OTHER USER'S ACTIVE ITEMS
app.get("/api/items/others", auth, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ now this exists

    const items = await Item.find({
      userId: { $ne: userId },
      returned: { $ne: true },
      status: { $in: ["lost", "found", "Lost", "Found"] },
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load items" });
  }
});

//Get current user's own posts
app.get("/api/items/mine", auth, async (req, res) => {
  const items = await Item.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(items);
});

// REGISTER USER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save to MongoDB
    await new User({
      name,
      email,
      passwordHash,
      role: "user",
    }).save();

    res.json({ message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// -------------------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
