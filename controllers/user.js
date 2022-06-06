const handleSuccess = require('../service/handleSuccess');
const User = require('../model/user');
const appError = require('../service/appError');
const Posts = require('../model/post');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const handleErrorAsync = require('../service/handleErrorAsync');
const { generateSendJWT } = require('../service/auth');

const user = {
  async getUsers(req, res) {
    const getAllUsers = await User.find();
    handleSuccess(res, getAllUsers);
  },
  async register(req, res, next) {
    let { email, password, confirmPassword, name } = req.body;
    // 內容不可為空
    if (!email || !password || !confirmPassword || !name) {
      return appError(400, `欄位未填寫正確`, next);
    }
    // 密碼不正確
    if (password !== confirmPassword) {
      return appError(400, `密碼不一致`, next);
    }
    // 密碼8碼
    if (!validator.isLength(password, { min: 8 })) {
      return appError(400, `密碼字數低於8碼`, next);
    }
    // 是否是email
    if (!validator.isEmail(email)) {
      return appError(400, `email格式不正確`, next);
    }
    // 加密密碼
    password = await bcrypt.hash(password, 12);
    const newUser = User.create({
      email,
      password,
      name,
    });
    generateSendJWT(newUser, 201, res);
  },
  async signIn(req, res, next) {
    let { email, password } = req.body;
    // 內容不可為空
    if (!email || !password) {
      return appError(400, `帳號密碼不可為空`, next);
    }

    // +號表示要顯示
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return appError(400, `無此帳號`, next);
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return appError(400, `密碼錯誤`, next);
    }
    generateSendJWT(user, 200, res);
  },
  async profile(req, res, next) {
    handleSuccess(res, req.user);
  },
  async updatePassword(req, res, next) {
    let { password, confirmPassword } = req.body;
    // 密碼不符
    if (password !== confirmPassword) {
      return appError(400, `密碼不一致`, next);
    }
    // 加密密碼
    let newPassword = await bcrypt.hash(password, 12);

    const user = User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });
    generateSendJWT(user, 200, res);
  },
};
module.exports = user;
