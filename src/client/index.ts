// client.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ioClient from 'socket.io-client';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('Client is running');
});

const SERVER_URL = 'http://localhost:3000';
const socket = ioClient(SERVER_URL);

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('message', (data) => {
  console.log('Received:', data);
});

// setTimeout(() => {
//   console.log('About to send new recipe')
//   socket.emit('saveRecipe', {
//     "Name": "Recipe name",
//     "Description": "Recipe description",
//     "CookingTimeInMinutes": 60,
//     "Cost": 10,
//     "Method": [
//         "Step 1 in method",
//         "Step 2 in method"
//     ],
//     "Ingredients": [ 
//         {
//             "Name": "Ingredient1 name",
//             "Description": "Ingredient1 description",
//             "Quantity": 2.5,
//             "QuantityType": "kg"
//         }
//     ]
//   })
// }, 4000)

setTimeout(() => socket.emit('recipes', { count: 5 }), 1000)


socket.on('recipes', (data) => {
  console.log('count', data.length)
  console.log('Received:', data);
});


socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Client is running on port ${PORT}`);
});