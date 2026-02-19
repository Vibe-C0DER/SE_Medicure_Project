import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum : ["male", "female", "other"],
      default : "male",
    },
    age : {
      type : Number,
      default : 18,
      min: 0,
      max: 120,
    },
    location : {
      type : String,
      default : "India",
      trim: true,
      maxlength: 100,
    },
    bio : {
      type : String,
      default : "Add your bio here",
      trim: true,
      maxlength: 500,
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      trim: true,
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;