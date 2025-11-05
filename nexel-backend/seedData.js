import Asset from './models/assetModel.js';
import Tutorial from './models/tutorialModel.js';
import ShowcaseGame from './models/showcaseGameModel.js';
import User from './models/userModel.js';
import Progress from './models/progressModel.js';
import { connectDB } from './config/database.js';

// Sample data
const sampleAssets = [
  {
    name: 'Neon City Skyline',
    description: 'Stunning cyberpunk cityscape with neon lights and futuristic buildings',
    category: '3D Models',
    fileUrl: '/assets/neon-city.zip',
    thumbnailUrl: '/src/assets/asset-neon-city.jpg',
    price: 29.99,
    downloadCount: 156,
    rating: 4.8,
    tags: ['cyberpunk', 'city', 'neon', '3d'],
    creator: null, // Set to null to avoid foreign key constraint
    status: 'published',
    requiredSubscription: 'Starter',
    detailedDescription: 'High-quality 3D model perfect for your cyberpunk projects',
    compatibility: ['Unity', 'Unreal Engine', 'Blender'],
    features: ['4K Textures', 'Low Poly', 'Game Ready'],
    fileSize: '125 MB',
    fileType: '.fbx',
    version: '1.0',
    requirements: ['Unity 2020+', '8GB RAM']
  },
  {
    name: 'Holographic Effects Pack',
    description: 'Futuristic holographic UI elements and visual effects',
    category: 'VFX',
    fileUrl: '/assets/holo-effects.zip',
    thumbnailUrl: '/src/assets/asset-holographic-effects.jpg',
    price: 19.99,
    downloadCount: 243,
    rating: 4.9,
    tags: ['UI', 'hologram', 'effects', 'futuristic'],
    creator: 1,
    status: 'published',
    requiredSubscription: 'Starter',
    detailedDescription: 'Complete holographic effects pack with animated elements',
    compatibility: ['Photoshop', 'Figma', 'Unity'],
    features: ['PNG Sequences', 'Alpha Channel', 'HD Quality'],
    fileSize: '85 MB',
    fileType: '.png',
    version: '2.1',
    requirements: []
  },
  {
    name: 'Cyberpunk Character Pack',
    description: 'Complete character models for cyberpunk games',
    category: '3D Models',
    fileUrl: '/assets/character-pack.zip',
    thumbnailUrl: '/src/assets/asset-character-pack.jpg',
    price: 39.99,
    downloadCount: 189,
    rating: 4.7,
    tags: ['character', '3d', 'cyberpunk', 'models'],
    creator: 1,
    status: 'published',
    requiredSubscription: 'Pro',
    detailedDescription: 'High-quality character models with multiple customization options',
    compatibility: ['Unity', 'Unreal Engine', 'Blender'],
    features: ['Rigged', 'PBR Textures', 'Multiple LODs'],
    fileSize: '450 MB',
    fileType: '.fbx',
    version: '1.0',
    requirements: ['Unity 2019+', 'Humanoid Rig Support']
  },
  {
    name: 'Retro UI Elements',
    description: 'Stunning retro-futuristic UI components and interfaces',
    category: 'Textures',
    fileUrl: '/assets/retro-ui.zip',
    thumbnailUrl: '/src/assets/asset-retro-ui.jpg',
    price: 49.99,
    downloadCount: 178,
    rating: 4.9,
    tags: ['UI', 'retro', 'interface', 'synthwave'],
    creator: 1,
    status: 'published',
    requiredSubscription: 'Pro',
    detailedDescription: 'Complete retro UI kit with synthwave aesthetics',
    compatibility: ['Figma', 'Photoshop', 'Unity'],
    features: ['Vector Format', 'Customizable', 'Responsive'],
    fileSize: '220 MB',
    fileType: '.svg',
    version: '3.0',
    requirements: ['Design Software']
  },
  {
    name: 'Cyber Workspace Environment',
    description: 'Complete cyberpunk workspace scene with props',
    category: '3D Models',
    fileUrl: '/assets/cyber-workspace.zip',
    thumbnailUrl: '/src/assets/cyber-workspace.jpg',
    price: 34.99,
    downloadCount: 134,
    rating: 4.6,
    tags: ['environment', 'scene', 'workspace', 'cyberpunk'],
    creator: 1,
    status: 'published',
    requiredSubscription: 'Starter',
    detailedDescription: 'Detailed workspace environment perfect for cyberpunk scenes',
    compatibility: ['Unity', 'Unreal Engine', 'Blender'],
    features: ['Game Ready', 'Modular', 'PBR Materials'],
    fileSize: '95 MB',
    fileType: '.fbx',
    version: '1.5',
    requirements: ['Unity 2019+']
  },
  {
    name: 'Neon City Background Pack',
    description: 'High-resolution cyberpunk city backgrounds',
    category: 'Textures',
    fileUrl: '/assets/city-backgrounds.zip',
    thumbnailUrl: '/src/assets/asset-neon-city.jpg',
    price: 24.99,
    downloadCount: 267,
    rating: 4.8,
    tags: ['background', 'city', 'neon', 'panorama'],
    creator: 1,
    status: 'published',
    requiredSubscription: 'Starter',
    detailedDescription: 'Stunning 4K cyberpunk city skylines and backgrounds',
    compatibility: ['All Software'],
    features: ['4K Resolution', '360 Panorama', 'HDR'],
    fileSize: '680 MB',
    fileType: '.png',
    version: '1.0',
    requirements: []
  }
];

const sampleTutorials = [
  {
    title: 'Getting Started with Unity',
    description: 'Learn the basics of Unity game engine',
    content: 'Comprehensive tutorial covering Unity fundamentals...',
    category: 'Beginner',
    thumbnailUrl: '/src/assets/cyber-workspace.jpg',
    videoUrl: 'https://example.com/unity-tutorial',
    duration: 45,
    author: 1,
    tags: ['Unity', 'Beginner', 'Game Dev'],
    status: 'published',
    requiredSubscription: 'Starter',
    likes: 234,
    views: 1520
  },
  {
    title: 'Advanced Shader Programming',
    description: 'Master shader programming for stunning visual effects',
    content: 'In-depth shader tutorial...',
    category: 'Expert',
    thumbnailUrl: '/src/assets/asset-holographic-effects.jpg',
    videoUrl: 'https://example.com/shader-tutorial',
    duration: 120,
    author: 1,
    tags: ['Shaders', 'Advanced', 'VFX'],
    status: 'published',
    requiredSubscription: 'Pro',
    likes: 567,
    views: 3245
  },
  {
    title: 'Creating Cyberpunk Environments',
    description: 'Build stunning cyberpunk worlds',
    content: 'Step-by-step environment creation...',
    category: 'Intermediate',
    thumbnailUrl: '/src/assets/asset-neon-city.jpg',
    videoUrl: 'https://example.com/env-tutorial',
    duration: 90,
    author: 1,
    tags: ['Environment', 'Cyberpunk', '3D'],
    status: 'published',
    requiredSubscription: 'Starter',
    likes: 445,
    views: 2890
  }
];

const sampleGames = [
  {
    title: "Neon Runner",
    description: "Dash through glowing cityscapes and collect energy orbs.",
    author: "System",
    tags: ["#cyberpunk", "#endlessrunner"],
    thumbnail: "/src/assets/game-neon-runner.jpg",
    gameUrl: "https://example.com/neon-runner-demo",
    likes: 156
  },
  {
    title: "Hologram Defense",
    description: "Protect your mainframe with holographic shields.",
    author: "System",
    tags: ["#towerdefense", "#synthwave"],
    thumbnail: "/src/assets/game-cyber-heist.jpg",
    gameUrl: "https://example.com/hologram-defense",
    likes: 234
  },
  {
    title: "Synthwave Drift",
    description: "Race through neon highways in a synthwave atmosphere.",
    author: "System",
    tags: ["#racing", "#retro"],
    thumbnail: "/src/assets/game-synthwave-racing.jpg",
    gameUrl: "https://example.com/synth-drift",
    likes: 189
  },
  {
    title: "Neon Grid Escape",
    description: "Escape the grid while avoiding security drones.",
    author: "System",
    tags: ["#arcade", "#stealth"],
    thumbnail: "/src/assets/asset-neon-city.jpg",
    gameUrl: "https://example.com/neon-grid-escape",
    likes: 145
  }
];

// Sample leaderboard users
const sampleLeaderboardUsers = [
  {
    username: 'CyberNinja',
    email: 'cyberninja@nexel.com',
    password: 'Demo123!',
    role: 'user',
    xp: 8750,
    level: 15,
    subscriptionPlan: 'Pro'
  },
  {
    username: 'NeonMaster',
    email: 'neonmaster@nexel.com',
    password: 'Demo123!',
    role: 'user',
    xp: 7200,
    level: 12,
    subscriptionPlan: 'Pro'
  },
  {
    username: 'PixelWarrior',
    email: 'pixelwarrior@nexel.com',
    password: 'Demo123!',
    role: 'user',
    xp: 6500,
    level: 11,
    subscriptionPlan: 'Starter'
  },
  {
    username: 'GlitchHunter',
    email: 'glitchhunter@nexel.com',
    password: 'Demo123!',
    role: 'user',
    xp: 5800,
    level: 10,
    subscriptionPlan: 'Pro'
  },
  {
    username: 'SynthDev',
    email: 'synthdev@nexel.com',
    password: 'Demo123!',
    role: 'user',
    xp: 4900,
    level: 8,
    subscriptionPlan: 'Starter'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to database
    await connectDB();
    
    // Create a sample user first
    console.log('👤 Creating sample user...');
    let sampleUser = await User.findOne({ where: { email: 'demo@nexel.com' } });
    
    if (!sampleUser) {
      sampleUser = await User.create({
        username: 'Demo Creator',
        email: 'demo@nexel.com',
        password: 'Demo123!', // Will be hashed by the model
        role: 'user',
        subscriptionPlan: 'Pro'
      });
      console.log('✅ Created sample user with ID:', sampleUser.id);
    } else {
      console.log('✅ Using existing sample user with ID:', sampleUser.id);
    }
    
    // Update creator IDs in sample data
    const assetsWithCreator = sampleAssets.map(asset => ({ ...asset, creator: sampleUser.id }));
    const tutorialsWithAuthor = sampleTutorials.map(tutorial => ({ ...tutorial, author: sampleUser.id }));
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Asset.destroy({ where: {} });
    await Tutorial.destroy({ where: {} });
    await ShowcaseGame.destroy({ where: {} });
    await Progress.destroy({ where: {} });
    
    // Create leaderboard users
    console.log('👥 Creating leaderboard users...');
    const createdUsers = [];
    for (const userData of sampleLeaderboardUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        const newUser = await User.create(userData);
        createdUsers.push(newUser);
      } else {
        createdUsers.push(existingUser);
      }
    }
    console.log(`✅ Created ${createdUsers.length} leaderboard users`);
    
    // Create progress records for leaderboard users
    console.log('📊 Creating progress records...');
    const progressData = createdUsers.map((user, index) => ({
      user: user.id,
      level: sampleLeaderboardUsers[index].level,
      currentXP: sampleLeaderboardUsers[index].xp,
      nextLevelXP: sampleLeaderboardUsers[index].level * 1000,
      completionPercentage: (sampleLeaderboardUsers[index].xp / (sampleLeaderboardUsers[index].level * 1000)) * 100,
      badges: ['early_adopter', 'tutorial_complete'],
      tutorialProgress: {}
    }));
    await Progress.bulkCreate(progressData);
    console.log(`✅ Created ${progressData.length} progress records`);
    
    // Seed assets
    console.log('📦 Seeding assets...');
    await Asset.bulkCreate(assetsWithCreator);
    console.log(`✅ Created ${assetsWithCreator.length} assets`);
    
    // Seed tutorials
    console.log('📚 Seeding tutorials...');
    await Tutorial.bulkCreate(tutorialsWithAuthor);
    console.log(`✅ Created ${tutorialsWithAuthor.length} tutorials`);
    
    // Seed showcase games
    console.log('🎮 Seeding showcase games...');
    await ShowcaseGame.bulkCreate(sampleGames);
    console.log(`✅ Created ${sampleGames.length} games`);
    
    console.log('🎉 Database seeded successfully!');
    console.log('📧 Demo user email: demo@nexel.com');
    console.log('🔑 Demo user password: Demo123!');
    console.log('🏆 Leaderboard users created with progress data');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
