// src/RealTimeChart.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

// Connect to the backend server (adjust the URL if necessary)
const socket = io('http://localhost:3009');

const RealTimeChart = () => {
  const [data, setData] = useState([]);

  // Fetch fallback/historical data from the REST API
  const fetchFallbackData = async () => {
    try {
        console.log("Inside FetchFallbackData")
      const response = await fetch('http://localhost:3009/getData');
      const jsonData = await response.json();
      console.log(jsonData)
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching fallback data:', error);
    }
  };

  useEffect(() => {
    // Listen for real-time data from WebSocket
    console.log("Inside useEffect")
    socket.on('newData', (newRecord) => {
      setData(prevData => [...prevData, newRecord]);
      return newRecord.length > 100 ? newRecord.slice(newRecord.length - 100) : newRecord;
    });

    // Fetch fallback data when the component mounts
    fetchFallbackData();

    // Clean up the socket connection on unmount
    return () => {
      socket.off('newData');
    };
  }, []);

  // Format the time (x-axis tick) for display
  const formatTime = (tick) => {
    const date = new Date(tick);
    return date.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit', millisecond: 'numeric' });
  };


  return (
    <div>
      <h2>Real-Time Data Chart</h2>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" tickFormatter={formatTime} type="number" domain={['dataMin', 'dataMax']} />
        <YAxis />
        <Tooltip labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} isAnimationActive={false} />
      </LineChart>
    </div>
  );
};

export default RealTimeChart;
