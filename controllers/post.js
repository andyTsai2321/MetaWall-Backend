const mongoose = require('mongoose');
const handleSuccess = require('../service/handleSuccess');
const Posts = require('../model/post');
const User = require('../model/user');
const appError = require('../service/appError');

const posts = {
  async getPosts(req, res) {
    const { sort, keyword } = req.query;
    const timeSort = sort === 'asc' ? 'createdAt' : '-createdAt';

    const getPosts = await Posts.find().sort(timeSort).populate({
      path: 'user',
      select: 'name photo',
    });
    handleSuccess(res, getPosts);
  },
  async createPosts(req, res, next) {
    const { body } = req;
    if (!body.content) {
      return appError(400, 'content不可為空', next);
    }
    const newPost = await Posts.create({
      user: req.user.id,
      image: body.image,
      createAt: body.createAt,
      content: body.content,
    });
    handleSuccess(res, newPost);
  },
  async deleteAllPosts(req, res) {
    await Posts.deleteMany({});
    handleSuccess(res);
  },
  async deletePost(req, res, next) {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return appError(400, 'id格式錯誤', next);
    }

    await Posts.findByIdAndDelete(id);
    const getPosts = await Posts.find();
    handleSuccess(res, getPosts);
  },
  async updatePost(req, res, next) {
    const id = req.params.id;
    const { body } = req;

    if (!mongoose.isValidObjectId(id)) {
      return appError(400, 'id格式錯誤', next);
    }

    if (!body.content) {
      return appError(400, 'content不可為空', next);
    }

    await Posts.findByIdAndUpdate(id, {
      name: body.name,
      content: body.content,
      image: body.image,
    });
    const getPosts = await Posts.find();
    handleSuccess(res, getPosts);
  },
};
module.exports = posts;
