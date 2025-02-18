// src/RealTimeChart.js
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const RealTimeChart = () => {
  const [data, setData] = useState([]);
  // Use a ref to hold the interval ID
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start an interval to simulate data updates
    // Warning: Updating every millisecond (1ms) may be too frequent for UI rendering.
    // Here we use 100ms for demonstration. Adjust as needed.
    intervalRef.current = setInterval(() => {
      const now = Date.now(); // current timestamp in milliseconds
      const newDataPoint = {
        time: now,
        value: Math.random() * 100, // simulate a random value
      };
      // Optionally, limit the number of data points to keep the chart performant.
      setData(prevData => {
        const newData = [...prevData, newDataPoint];
        // Keep only the latest 100 points (for example)
        return newData.length > 100 ? newData.slice(newData.length - 100) : newData;
      });
    }, 100); // 100ms interval

    // Cleanup on component unmount
    return () => clearInterval(intervalRef.current);
  }, []);

  // Format the time for the X axis
  const formatTime = (tick) => {
    const date = new Date(tick);
    return date.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit', millisecond: 'numeric' });
  };

  return (
    <div>
      <h2>Real-Time Data Chart</h2>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis 
          dataKey="time" 
          domain={['dataMin', 'dataMax']} 
          tickFormatter={formatTime}
          type="number"
        />
        <YAxis />
        <Tooltip labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} isAnimationActive={false}/>
      </LineChart>
    </div>
  );
};

export default RealTimeChart;
