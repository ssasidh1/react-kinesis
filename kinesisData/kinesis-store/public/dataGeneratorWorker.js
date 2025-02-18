// dataGeneratorWorker.js

// Import the AWS SDK into the web worker.
// Make sure to use a version that supports your needs.
importScripts('https://sdk.amazonaws.com/js/aws-sdk-2.1107.0.min.js');

// Configure AWS (for a real app, consider using Cognito or similar for secure credentials)
AWS.config.update({
  region: 'us-east-1',
  // Using Cognito Identity Pool credentials (example):
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:db54d1da-f492-42c7-8e9b-90c0c6bdb13d'
  })
});

// Create a Kinesis client instance
const kinesis = new AWS.Kinesis();

// Function to generate a record and send it to Kinesis
function generateData() {
  const record = {
    time: Date.now(), // timestamp
    value: Math.floor(Math.random() * 100) // a random value
  };

  const params = {
    Data: JSON.stringify(record),
    PartitionKey: 'sensor-2', // For demo, a static key; use something dynamic in production
    StreamName: 'chartData'   // Replace with your Kinesis stream name
  };

  kinesis.putRecord(params, (err, data) => {
    if (err) {
      console.error('Error sending data:', err);
      // Optionally, post a message to the main thread about the error:
      postMessage({ type: 'error', error: err });
    } else {
      console.log('Record sent:', data);
      // Optionally, notify the main thread that a record was sent:
      postMessage({ type: 'recordSent', record: record, response: data });
    }
  });
}

// Generate data every second
setInterval(generateData, 1000);
