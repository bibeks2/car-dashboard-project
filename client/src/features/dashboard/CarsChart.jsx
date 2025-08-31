import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CarsChart = () => {
  const { filteredData: cars, status } = useSelector((state) => state.cars);

  const chartData = useMemo(() => {
    if (!cars || cars.length === 0) return null;

    const origins = ['USA', 'Europe', 'Japan'];
    const dataByOrigin = origins.reduce((acc, origin) => {
      acc[origin] = { totalHorsepower: 0, count: 0 };
      return acc;
    }, {});

    cars.forEach(car => {
      if (dataByOrigin[car.origin] && car.horsepower != null) {
        dataByOrigin[car.origin].totalHorsepower += car.horsepower;
        dataByOrigin[car.origin].count++;
      }
    });

    const labels = origins;
    const data = origins.map(origin => {
      const { totalHorsepower, count } = dataByOrigin[origin];
      return count > 0 ? (totalHorsepower / count).toFixed(2) : 0;
    });

    return {
      labels,
      datasets: [ { label: 'Average Horsepower', data, backgroundColor: 'rgba(53, 162, 235, 0.5)' } ],
    };
  }, [cars]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Average Horsepower by Origin' },
    },
    scales: { y: { beginAtZero: true } }
  };
  
  if (status === 'loading') {
      return <Typography>Loading chart data...</Typography>
  }

  if (!chartData) {
      return <Typography>No data available to display chart.</Typography>
  }

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Bar options={options} data={chartData} />
    </Box>
  );
};

export default CarsChart;