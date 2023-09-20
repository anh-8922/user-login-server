import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: String,
  image: String,
  emailVerified: {
    type: String,
    default: false,
  },
  registrationToken: String,
  changePassToken: String,
});

export default mongoose.model("User", userSchema);
