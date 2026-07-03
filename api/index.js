const app = require('../server/app');
const mongoose = require('mongoose');

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const maskedUri = rawUri ? rawUri.replace(/:([^:@]+)@/, ':****@') : 'undefined';
  console.log(`Connecting to MongoDB using URI: ${maskedUri}`);
  
  try {
    const db = await mongoose.connect(rawUri);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw new Error(`Mongoose failed to connect: ${err.message} (URI: ${maskedUri})`);
  }
};

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (err) {
    console.error('Cold start database connection failed:', err);
    return res.status(500).json({
      message: 'Cold start database connection failed',
      errorName: err.name,
      errorMessage: err.message,
      errorStack: err.stack
    });
  }
};
