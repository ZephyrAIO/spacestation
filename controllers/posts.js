const Post = require('../models/post');
const { cloudinary } = require('../cloudinary');

// Exports
// C
module.exports.renderCreate = (req, res) => {
    res.render('posts/new');
}

module.exports.create = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.image.url = req.file.path
    post.image.filename = req.file.filename
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Post created');
    res.redirect(`${post._id}`);
}

// R
module.exports.renderIndex = async (req, res) => {
    const posts = await Post.find({}).sort({ createdOn: 'desc'}).populate('author');
    res.render('posts/index', { posts });
}

module.exports.renderShow = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author').populate({
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
    res.render('posts/show', { post, user });
}

// U
module.exports.renderUpdate = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        req.flash('error', 'You almost fell down a hole of nothing! But, you\'re safe now.');
        return res.redirect('/profile');
    }
    res.render('posts/edit', { post });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post })
    post.modifiedOn =  new Date().toISOString()
    if (req.file) {
        await cloudinary.uploader.destroy(post.image.filename)
        post.image.url = req.file.path
        post.image.filename = req.file.filename
    }
    await post.save();
    req.flash('success', 'Post updated');
    res.redirect(`/${post._id}`);
}

// D
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/');
}