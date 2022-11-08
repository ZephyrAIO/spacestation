const Comment = require('../models/comment')
const Post = require('../models/post')

module.exports.create = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    post.comments.push(comment);
    await post.save();
    await comment.save();
    res.redirect(`/posts/${post._id}`);
}

module.exports.delete = async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/posts/${id}`)
}