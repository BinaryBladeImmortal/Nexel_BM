import multer from 'multer';
import cloudinaryPkg from 'cloudinary';
const cloudinary = cloudinaryPkg.v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for different file types
const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `nexel/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp3', 'mp4', 'obj', 'fbx', 'glb', 'gltf'],
      resource_type: 'auto'
    }
  });
};

// Create multer instances for different upload types
export const uploadAsset = multer({
  storage: createStorage('assets'),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

export const uploadThumbnail = multer({
  storage: createStorage('thumbnails'),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

export const uploadAttachment = multer({
  storage: createStorage('attachments'),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Function to delete file from Cloudinary
export const deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

// Function to get public ID from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  const splitUrl = url.split('/');
  const filename = splitUrl[splitUrl.length - 1];
  return `nexel/${splitUrl[splitUrl.length - 2]}/${filename.split('.')[0]}`;
};