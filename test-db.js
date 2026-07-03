const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://suyashzope789_db_user:j4kcdB4DWMRJRN8k@cluster0.c3ysfci.mongodb.net/3dmenu?retryWrites=true&w=majority&appName=Cluster0";

console.log("Attempting to connect to MongoDB...");
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("ERROR: Failed to connect to MongoDB Atlas!");
    console.error(err);
    process.exit(1);
  });
