import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage for different file types
const createStorage = (folder) => {
  const uploadDir = path.join(__dirname, '../../public/assets', folder);
  ensureDir(uploadDir);
  
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
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

// Function to delete file
const deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, '../../public', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
};

export { deleteFile };

// Function to get file URL
const getFileUrl = (req, filePath) => {
  if (!filePath) return null;
  return `${req.protocol}://${req.get('host')}/${filePath}`;
};

export { getFileUrl };
