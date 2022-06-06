const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '請填寫姓名'],
  },
  email: {
    type: String,
    required: [true, '請填寫信箱'],
    unique: true,
    lowercase: true,
    select: false,
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
  },
  password: {
    type: String,
    required: [true, '請輸入密碼'],
    minlength: 8,
    select: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'ads'],
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
