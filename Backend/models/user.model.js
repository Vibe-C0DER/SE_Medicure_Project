import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    },
    location : {
      type : String,
      default : "India",
    },
    bio : {
      type : String,
      default : "Add your bio here",
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;