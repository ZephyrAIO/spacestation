const Post = require('../models/post');
const { cloudinary } = require('../cloudinary');
const moment = require('moment');

// Exports
// C
module.exports.renderCreate = (req, res) => {
    res.render('posts/create');
}

module.exports.create = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.image.url = req.file.path
    post.image.filename = req.file.filename
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Post created');
    res.redirect(`posts/${post._id}`);
}

// R
module.exports.renderIndex = async (req, res) => {
    const posts = await Post.find({}).sort({ createdOn: 'desc' }).populate('author').populate('likes');
    res.render('posts/index', { posts, moment: moment });
}

module.exports.renderShow = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author').populate('likes').populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    });

    post.comments.reverse();
    if (!post) {
        req.flash('error', 'Its gone');
        return res.redirect('/');
    }
    const user = req.user
    res.render('posts/show', { post, moment: moment });
}

// U
module.exports.renderUpdate = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        req.flash('error', 'You almost fell down a hole of nothing! But, you\'re safe now.');
        return res.redirect('/profile');
    }
    res.render('posts/update', { post });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post })
    post.modifiedOn = new Date().toISOString()
    if (req.file) {
        await cloudinary.uploader.destroy(post.image.filename)
        post.image.url = req.file.path
        post.image.filename = req.file.filename
    }
    await post.save();
    req.flash('success', 'Post updated');
    res.redirect(`/posts/${post._id}`);
}

// D
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    await cloudinary.uploader.destroy(post.image.filename);
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Post deleted');
    res.redirect('/');
}