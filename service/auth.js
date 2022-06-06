const jwt = require('jsonwebtoken');
const handleErrorAsync = require('./handleErrorAsync');
const appError = require('./appError');
const User = require('../model/user');

const generateSendJWT = (user, stateCode, res) => {
  // console.log(user._id)
  // 產生JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  // 防呆
  user.password = undefined;

  res.status(stateCode).json({
    status: true,
    user: {
      token,
      name: user.name,
    },
  });
};
const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;
  const getAuth = req.headers.authorization;
  if (getAuth && getAuth.startsWith('Bearer')) {
    token = getAuth.split(' ')[1];
  }
  if (!token) {
    return appError(401, `您尚未登入`, next);
  }

  // 驗證token正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

  const currentUser = await User.findById(decoded.id);

  req.user = currentUser;
  next();
});

module.exports = {
  isAuth,
  generateSendJWT,
};
