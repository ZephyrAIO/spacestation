const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    likes: Number,
    dislikes: Number
});

module.exports = mongoose.model('Comment', CommentSchema);