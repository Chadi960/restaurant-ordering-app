const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 email: {
  type: String,
  required: true,
  trim: true,
  unique: true
 },
 fullName: {
  type: String,
  required: true,
  trim: true
 },
 password: {
  type: String,
  required: true
 },
 role: {
  type: String,
  default: 'user',
  enum: ["user", "admin"]
 },
 accessToken: {
  type: String
 },
 refreshToken: {
  type: String
 }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
