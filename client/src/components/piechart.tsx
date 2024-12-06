import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: number[];
  total: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, total }) => {
  const totalSum = data.reduce((acc, value) => acc + value, 0);
  const percentages = data.map((value) => (value / totalSum) * 100);

  const chartData = {
    labels: ['Hadir', 'Sakit', 'Dispen', 'Izin', 'Tanpa Keterangan'],
    datasets: [
      {
        data,
        backgroundColor: ['#34A853', '#6B8CB6', '#FFB200', '#B52FD7', '#940000'],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          generateLabels: (chart) => {
            const labels = chart.data.labels as string[];
            return chart.data.datasets[0].data.map((value, index) => {
              const percentage = percentages[index].toFixed(1);
              return {
                text: `${labels[index]} ${percentage}%`,
                fillStyle: chart.data.datasets[0].backgroundColor[index],
                strokeStyle: chart.data.datasets[0].backgroundColor[index],
                lineWidth: 1,
              };
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const percentage = percentages[tooltipItem.dataIndex].toFixed(1);
            return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="relative w-[300px] h-[300px]">
      <div
        className="absolute top-[38%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          text-center text-gray-800 font-bold border border-gray-400 
          rounded-full w-28 h-28 flex flex-col items-center justify-center bg-white z-0"
      >
        <span className="text-xl">Total</span>
        <span className="text-3xl font-bold">{total}</span>
      </div>
      <div className="relative z-10">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;