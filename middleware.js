// Utils
const ExpressError = require('./utils/ExpressError');
const { cloudinary } = require('./cloudinary');

// Schemas
const { postSchema, commentSchema } = require('./schemas.js');

// Models
const Post = require('./models/post');
const Comment = require('./models/comment');


// Exports
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Put your data in the bag and nobody gets hurt.');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You can\'t touch this')
        return res.redirect(`/${id}`)
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId)
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You can\'t touch this')
        return res.redirect(`/${id}`)
    }
    next();
}

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        if (req.file) {
            cloudinary.uploader.destroy(req.file.filename);
        }
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);

    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}