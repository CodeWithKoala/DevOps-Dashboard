import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { io } from 'socket.io-client';

function App() {
  const [health, setHealth] = useState({
    uptime: 0,
    cpuUsage: 0,
    memoryUsage: 0
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false
      },
      {
        label: 'Memory Usage (GB)',
        data: [],
        borderColor: 'rgba(255,99,132,1)',
        fill: false
      }
    ]
  });

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('systemData', (data) => {
      setHealth(data);

      setChartData(prevState => ({
        labels: [...prevState.labels, new Date().toLocaleTimeString()],
        datasets: [
          {
            ...prevState.datasets[0],
            data: [...prevState.datasets[0].data, data.cpuUsage]
          },
          {
            ...prevState.datasets[1],
            data: [...prevState.datasets[1].data, data.memoryUsage]
          }
        ]
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>DevOps Dashboard</h1>
      <h2>Server Health</h2>
      <p>Uptime: {Math.round(health.uptime)} seconds</p>
      <p>CPU Usage: {health.cpuUsage}%</p>
      <p>Memory Usage: {health.memoryUsage} GB</p>

      <h2>System Usage Over Time</h2>
      <Line
        data={chartData}
        options={{
          scales: {
            x: {
              title: { display: true, text: 'Time' }
            },
            y: {
              title: { display: true, text: 'Usage' }
            }
          }
        }}
      />
    </div>
  );
}

export default App;
