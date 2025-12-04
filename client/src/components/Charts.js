import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Charts({ lost, found, returned }) {
  const total = lost + found + returned;

  const percent = (value) =>
    total > 0 ? ((value / total) * 100).toFixed(1) : 0;

  const data = {
    labels: [
      `Lost (${percent(lost)}%)`,
      `Found (${percent(found)}%)`,
      `Returned (${percent(returned)}%)`,
    ],
    datasets: [
      {
        data: [lost, found, returned],
        backgroundColor: [
          "#dc3545", // Lost = Red
          "#ffc107", // Found = Yellow
          "#198754", // Returned = Green
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: 350, height: 300 }}>
      <Pie data={data} options={options} />
    </div>
  );
}
