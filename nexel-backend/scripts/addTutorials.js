// Script to add new tutorials to the database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Tutorial from '../models/tutorialModel.js';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nexel-cyber-forge', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// New tutorials data
const newTutorials = [
  {
    title: 'GDscript Coding Tutorial',
    description: 'Learn Godot\'s scripting language, GDscript, and build core game logic.',
    videoUrl: 'https://youtu.be/e1zJS31tr88?si=OzIUF9BROij3yn0L',
    difficulty: 'Intermediate',
    xpReward: 120,
    verified: false,
    duration: '45 min'
  },
  {
    title: 'Blender Tutorial 1',
    description: 'Create your first 3D model with Blender using neon cyberpunk textures.',
    videoUrl: 'https://youtu.be/Z8sg0nHNTTo?si=00Pk3WTwzOAz9Jjc',
    difficulty: 'Beginner',
    xpReward: 100,
    verified: false,
    duration: '30 min'
  },
  {
    title: 'Blender Tutorial 2',
    description: 'Master materials, lighting, and rendering in Blender with a futuristic vibe.',
    videoUrl: 'https://youtu.be/fiX0sO2ZYZ0?si=p5jPRLsNtR3KmGgJ',
    difficulty: 'Beginner',
    xpReward: 100,
    verified: false,
    duration: '35 min'
  },
  {
    title: 'Game 2 Tutorial (Brackeys Platformer)',
    description: 'Follow Brackeys\' step-by-step platformer tutorial and create your first 2D game.',
    videoUrl: 'https://youtu.be/LOhfqjmasi0?si=IpxW3PfTp1l9wYTx',
    difficulty: 'Beginner',
    xpReward: 150,
    verified: false,
    duration: '60 min'
  },
  {
    title: 'Game 1 Tutorial (Brackeys 3D Game)',
    description: 'Learn to build a 3D game in Godot with assets from Brackeys and Kenney.nl.',
    videoUrl: 'https://github.com/Brackeys/3d-game-in-godot',
    difficulty: 'Intermediate',
    xpReward: 200,
    verified: false,
    duration: '90 min'
  }
];

// Add tutorials to database
const addTutorials = async () => {
  try {
    // Clear existing tutorials with the same titles
    for (const tutorial of newTutorials) {
      await Tutorial.findOneAndDelete({ title: tutorial.title });
    }
    
    // Add new tutorials
    const result = await Tutorial.insertMany(newTutorials);
    console.log(`${result.length} tutorials added successfully`);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding tutorials:', error);
    mongoose.connection.close();
  }
};

// Run the function
addTutorials();