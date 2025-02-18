// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
var cors = require('cors')

const app = express();
app.use(cors({ origin: 'http://localhost:3002' }));
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3002", // Allow your React app's origin
      methods: ["GET", "POST"]
    }
  });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const kinesis = new AWS.Kinesis();

// --- Kinesis Consumer Logic ---
// This function demonstrates a very simplified polling mechanism.
// In production, consider using AWS Lambda triggers or the Kinesis Client Library.
async function pollKinesis() {
  const streamName = 'chartData'; // replace with your stream name

  try {
    console.log("Starting to poll");
    // Describe the stream to get shard information
    const streamDesc = await kinesis.describeStream({ StreamName: streamName }).promise();
    const shards = streamDesc.StreamDescription.Shards;
    if (!shards || shards.length === 0) {
      console.log('No shards available in the stream.');
      return;
    }
    console.log("shards",shards);
    // For demo purposes, take the first shard
    const shardId = shards[0].ShardId;

    // Get a shard iterator starting from the latest record
    const iteratorData = await kinesis.getShardIterator({
      StreamName: streamName,
      ShardId: shardId,
      ShardIteratorType: 'Latest' 
    }).promise();
    let shardIterator = iteratorData.ShardIterator;

    // Poll for records every 5 seconds
    setInterval(async () => {
      if (!shardIterator){
        console.log("No iterator found");
        return;
      } 
      const recordsResponse = await kinesis.getRecords({ ShardIterator: shardIterator, Limit: 10 }).promise();
      shardIterator = recordsResponse.NextShardIterator;
      if (recordsResponse.Records && recordsResponse.Records.length > 0) {
        console.log("Records",recordsResponse.Records);
        recordsResponse.Records.forEach(async (record) => {
          // Decode the Kinesis data (it comes as base64)
          const payload = Buffer.from(record.Data, 'base64').toString('utf-8');
          const dataObj = JSON.parse(payload);
          console.log('Record received from Kinesis:', dataObj, record.Data.partitionKey);

          // --- Write to DynamoDB ---
          const dbParams = {
            TableName: 'kinesisDB', // replace with your DynamoDB table name
            Item: {
              id: `${dataObj.time}-${Math.random()}`, // generate a unique id
              time: dataObj.time,
              value: dataObj.value
            }
          };
          try {
            await dynamoDB.put(dbParams).promise();
            console.log('Record written to DynamoDB:', dataObj);
          } catch (err) {
            console.error('Error writing record to DynamoDB:', err);
          }

          // --- Broadcast via WebSocket ---
          io.emit('newData', dataObj);
        });
      }
    }, 5000);
  } catch (err) {
    console.error('Error in pollKinesis:', err);
  }
}

// Start polling Kinesis


// --- REST API Endpoint (Fallback to DynamoDB) ---
app.get('/getData', async (req, res) => {
pollKinesis();
  const params = {
    TableName: 'kinesisDB' // replace with your table name
  };
  try {
    console.log("Getting data");
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);

  } catch (err) {
    console.error('Error fetching data from DynamoDB:', err);
    res.status(500).send(err);
  }
});

// Simple endpoint to test server
app.get('/', (req, res) => {
  res.send('Real-time Data Server is running.');
});

// Start the server on port 3000
server.listen(3009, () => {
  console.log('Server listening on port 3009');
});
