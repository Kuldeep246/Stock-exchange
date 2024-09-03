import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  TimeScale,
  LineController,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, TimeScale, LineController);

const StockChart = ({ data }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); 
    }

    const timeSeries = data;
    const labels = Object.keys(timeSeries).map(date => new Date(date).toLocaleDateString('en-CA')); 
    const closeValues = labels.map(date => timeSeries[date]['4. close']);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Close Value',
          data: closeValues,
          fill: true,
          borderColor: 'rgba(33, 150, 243, 1)',
          borderWidth: 1.5,
          tension: 0.3,
          pointRadius: 1,
        },
      ],
    };

    const options = {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          title: {
            display: true,
            text: 'Date',
            color: '#f5f5f5'
          },ticks: {
            color: '#f5f5f5' 
          }
        },
        y: {
          title: {
            display: true,
            text: 'Close Value',
            color: '#f5f5f5'
          },
          ticks: {
            color: '#f5f5f5' 
          }
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const date = context.label;
              const value = context.raw;
              return `Date: ${date}, Close Value: ${value}`;
            }
          }
        }
      }
    };

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new ChartJS(ctx, {
      type: 'line',
      data: chartData,
      options: options
    });

  }, [data]);

  if (!data) {
    return <p>No data available</p>;
  }

  return (

    <div className='bg-[#1b1b1b] w-2/3 mt-4 rounded-md mx-auto'>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default StockChart;
