import React, { useEffect } from 'react';
import './App.css';
import RealTimeChart from './RealTimeChart';

function App() {
  useEffect(() => {
    if (window.Worker) {
      // Use a leading slash to reference a worker in the public folder
      const dataGenWorker = new Worker('/dataGeneratorWorker.js');
    
      // Listen for messages from the worker (for logging or UI feedback)
      dataGenWorker.onmessage = function(event) {
        const { type, record, response, error } = event.data;
        if (type === 'recordSent') {
          console.log('Record generated and sent from worker:', record, response);
        } else if (type === 'error') {
          console.error('Worker encountered an error:', error);
        }
      };
    
      // Optionally, you can terminate the worker when needed:
      // return () => dataGenWorker.terminate();
    } else {
      console.error('Web Workers are not supported in this browser.');
    }
  }, []); // empty dependency array ensures this runs only once

  return (
    <div className="App">
      <RealTimeChart />
    </div>
  );
}

export default App;
