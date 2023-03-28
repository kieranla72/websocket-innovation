// server.ts
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectToDb, getRecipes, saveRecipe } from './mongo';

const app = express();
const server = createServer(app);
const io = new Server(server);


const delay = async () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

const socketDict = {}

io.on('connection', async (socket) => {

  socketDict[socket.id] = socket;
  console.log('socketDict', socketDict)
  console.log('Client connected');

  console.log(`socket: ${Object.keys(socket)}`)

  socket.on('disconnect', () => {
    delete socketDict[socket.id];
    console.log('Client disconnected');
  });

  socket.on('recipes', async(data) => {
    console.log(data);
    const recipeCount = data.count;

    for (let i=0; i < recipeCount; i++) {
      await delay();
      const recipes = await getRecipes('Recipe', i);
      console.log(recipes);
      socket.emit('recipes', recipes);
    }
  })

  socket.on('saveRecipe', async(data) => {
    console.log('Recipe received', data);
    await saveRecipe('Recipe', data)
    const recipes = await getRecipes('Recipe');
    socket.emit('recipes', recipes)
  })
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  await connectToDb();
  console.log(`Server is running on port ${PORT}`);
});