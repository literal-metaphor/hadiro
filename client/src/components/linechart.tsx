import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: number[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const getLabels = (): string[] => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = new Date();
    const labels: string[] = [];

    for (let i = data.length - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay()];
      labels.push(`${dayName}`);
    }

    return labels;
  };

  const labels = getLabels();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Kehadiran',
        data,
        borderColor: '#9A89FF',
        backgroundColor: 'rgba(154, 137, 255, 0.7)',
        tension: 0,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          display: labels.length <= 7,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;