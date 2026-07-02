const app = require('../server/app');
const mongoose = require('mongoose');

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
