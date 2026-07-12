/*
* User Model Example
* Used for defining the Model of Mongoose Schemas. There's no logic in this file!
* This code and comments is allowed to delete.
*/

import { Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: String,
  username: String,
  email: String,
  password: String
}, {
  timestamps: true
});

export default model("User", userSchema);
