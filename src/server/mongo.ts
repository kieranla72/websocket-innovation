import { MongoClient, Db } from 'mongodb';


// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kierancareer:WT7YEhoYNgITq5gh@recipebook.qyexezy.mongodb.net';

let db: Db;

export const connectToDb = async () => {
  try {
    const client = await MongoClient.connect(MONGODB_URI, {});
    db = client.db('RecipeBook');
    
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const getRecipes = async(collectionName: string, skip?: number) => {

    const collection = db.collection(collectionName);

    const recipesPromise = skip !== undefined
        ? collection.find({}).skip(skip).limit(1).toArray()
        : collection.find({}).toArray();

    const recipes = await recipesPromise;

    return recipes;
}

export const saveRecipe = async(collectionName: string, recipe: any) => {
    const collection = db.collection(collectionName);

    await collection.insertOne(recipe);

}