import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error('MONGO_URL is missing in .env. Add your MongoDB Atlas connection string.');
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;