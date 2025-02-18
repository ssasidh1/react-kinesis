// dataGenerator.js
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const kinesis = new AWS.Kinesis();

// Function to generate and send data to Kinesis
function generateData() {
  const record = {
    time: Date.now(), // timestamp for x-axis
    value: Math.floor(Math.random() * 100) // a random value for y-axis
  };

  const params = {
    Data: JSON.stringify(record),
    PartitionKey: 'partition-2', // simple partition key for demo
    StreamName: 'chartData' // replace with your stream name
  };

  kinesis.putRecord(params, (err, data) => {
    if (err) console.error('Error sending data to Kinesis:', err);
    else console.log('Record sent to Kinesis:', data);
  });
}

// Generate data every 1 second
setInterval(generateData, 1000);
