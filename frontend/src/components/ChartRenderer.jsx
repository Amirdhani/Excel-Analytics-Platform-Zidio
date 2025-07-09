import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartRenderer = ({ data, xKey, yKey, chartType }) => {
  if (!data || !Array.isArray(data)) {
    return <p>No chart data available.</p>;
  }

  const colorPalette = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#8BC34A', '#F44336',
    '#3F51B5', '#E91E63', '#00BCD4', '#CDDC39'
  ];

  const chartMap = {
    bar: Bar,
    line: Line,
    pie: Pie,
    scatter: Scatter
  };

  const ChartComp = chartMap[chartType] || Bar;

  const chartData =
    chartType === 'scatter'
      ? {
          datasets: [
            {
              label: `${yKey} vs ${xKey}`,
              data: data.map(item => ({
                x: Number(item[xKey]) || 0,
                y: Number(item[yKey]) || 0
              })),
              backgroundColor: 'rgba(75,192,192,0.6)',
              borderColor: 'rgba(75,192,192,1)'
            }
          ]
        }
      : {
          labels: data.map(item => item[xKey]),
          datasets: [
            {
              label: `${yKey} by ${xKey}`,
              data: data.map(item => Number(item[yKey]) || 0),
              backgroundColor:
                chartType === 'pie'
                  ? colorPalette.slice(0, data.length)
                  : 'rgba(75,192,192,0.6)',
              borderColor:
                chartType === 'pie' ? '#fff' : 'rgba(75,192,192,1)',
              borderWidth: 1
            }
          ]
        };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  return <ChartComp data={chartData} options={options} />;
};

export default ChartRenderer;
