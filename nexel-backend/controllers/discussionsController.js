import Message from '../models/messageModel.js';
import { Op } from 'sequelize';

// Simple in-memory SSE broadcast for discussions
const clients = new Set();
const MESSAGE_LIMIT = 10; // Maximum number of messages to keep

// Send message to all connected clients
const broadcastMessage = (msg) => {
  const messageData = {
    id: msg.id,
    user: msg.user,
    text: msg.text,
    ts: msg.timestamp.toISOString()
  };
  
  for (const client of clients) {
    client.write(`event: message\n`);
    client.write(`data: ${JSON.stringify(messageData)}\n\n`);
  }
};

/**
 * Remove oldest messages if we've exceeded the message limit
 * Keeps only the most recent MESSAGE_LIMIT messages
 */
const cleanupOldMessages = async () => {
  try {
    // Get the count of all messages
    const count = await Message.count();
    
    // If we're over the limit, delete the oldest messages
    if (count > MESSAGE_LIMIT) {
      const messagesToKeep = await Message.findAll({
        order: [['timestamp', 'DESC']],
        limit: MESSAGE_LIMIT,
        attributes: ['id']
      });
      
      // Delete all messages except the ones we want to keep
      const idsToKeep = messagesToKeep.map(m => m.id);
      await Message.destroy({
        where: {
          id: { [Op.notIn]: idsToKeep }
        }
      });
      
      console.log(`Cleaned up ${count - MESSAGE_LIMIT} old messages`);
    }
  } catch (error) {
    console.error('Error cleaning up old messages:', error);
  }
};

export const stream = async (req, res) => {
  try {
    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Credentials': 'true'
    });

    // Send a comment to establish the connection
    res.write(':\n\n');

    // Add client to the set
    clients.add(res);

    // Send initial connection message with retry
    res.write(`retry: 1000\n`);
    res.write(`event: ping\n`);
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    // Get the last 10 messages (or fewer) in ascending order
    const messages = await Message.findAll({
      order: [['timestamp', 'ASC']], // Sort by oldest first for proper display
      limit: MESSAGE_LIMIT,
      raw: true
    });

    // Send each message to the client
    messages.forEach(msg => {
      res.write(`event: message\n`);
      res.write(`data: ${JSON.stringify({
        id: msg.id,
        user: msg.user,
        text: msg.text,
        ts: new Date(msg.timestamp).toISOString()
      })}\n\n`);
    });

    // Handle client disconnect
    req.on('close', () => {
      clients.delete(res);
      res.end();
    });
  } catch (error) {
    console.error('Error in SSE stream:', error);
    clients.delete(res);
    res.status(500).end();
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { user, text } = req.body || {};
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Create and save the message to SQLite
    const message = await Message.create({
      user: user || 'Guest',
      text: text.trim(),
      timestamp: new Date()
    });
    
    // Clean up old messages if we're over the limit
    await cleanupOldMessages();

    // Broadcast the new message to all connected clients
    broadcastMessage(message);

    res.json({ 
      ok: true, 
      message: {
        id: message.id,
        user: message.user,
        text: message.text,
        ts: message.timestamp
      } 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};


