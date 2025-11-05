import { deleteFile, getFileUrl } from '../config/localStorage.js';

// Handle cleanup when file uploads fail
export const cleanupOnError = (req, res, next) => {
  if (req.file) {
    // Delete the uploaded file if it exists
    deleteFile(req.file.path).catch(console.error);
  }
  next();
};

export const handleFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Store the relative path in the database
  req.body.fileUrl = `assets/${req.file.filename}`;
  next();
};

export const handleThumbnailUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No thumbnail uploaded' });
  }
  // Store the relative path in the database
  req.body.thumbnailUrl = `assets/${req.file.filename}`;
  next();
};

export const handleAttachmentsUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No attachments uploaded' });
  }
  // Store the relative paths in the database
  req.body.attachments = req.files.map(file => `assets/${file.filename}`);
  next();
};

// Middleware to add full URLs to the response
// This should be used after the route handler but before sending the response
export const addFileUrls = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    if (Array.isArray(data)) {
      data = data.map(item => addUrlsToItem(req, item));
    } else if (data) {
      data = addUrlsToItem(req, data);
    }
    originalJson.call(this, data);
  };
  
  next();
};

// Helper function to add full URLs to an item
function addUrlsToItem(req, item) {
  if (!item) return item;
  
  const result = { ...item };
  
  // Handle fileUrl
  if (result.fileUrl) {
    result.fileUrl = getFileUrl(req, result.fileUrl);
  }
  
  // Handle thumbnailUrl
  if (result.thumbnailUrl) {
    result.thumbnailUrl = getFileUrl(req, result.thumbnailUrl);
  }
  
  // Handle attachments array
  if (Array.isArray(result.attachments)) {
    result.attachments = result.attachments.map(url => getFileUrl(req, url));
  }
  
  // Handle nested objects (like in populate queries)
  if (result._doc) {
    result._doc = addUrlsToItem(req, result._doc);
  }
  
  return result;
}