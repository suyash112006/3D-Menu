const mongoose = require('../server/node_modules/mongoose');
mongoose.set('bufferCommands', false);

const app = require('../server/app');

const connectToDatabase = async () => {
  const readyState = mongoose.connection.readyState;
  
  if (readyState === 1) {
    console.log('MongoDB is already connected');
    return;
  }
  
  if (readyState === 2) {
    console.log('MongoDB is currently connecting, waiting...');
    return new Promise((resolve) => {
      mongoose.connection.once('connected', () => resolve());
      mongoose.connection.once('error', () => resolve());
      setTimeout(() => resolve(), 3000); // safety fallback timeout
    });
  }

  const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const maskedUri = rawUri ? rawUri.replace(/:([^:@]+)@/, ':****@') : 'undefined';
  console.log(`Connecting to MongoDB using URI: ${maskedUri}`);
  
  try {
    await mongoose.connect(rawUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
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
