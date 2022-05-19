const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user')
const Post = require('./post')


const LikeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
})


LikeSchema.pre('deleteMany', async function () {
    let deletedLikes = await likeModel.find(this._conditions);
    deletedLikes.forEach(async (like) => {
        const updatedUser = await User.updateOne({ _id: like.user }, { $pull: { "likes": like._id } })
        // const updatedPost = await Post.updateOne({ _id: like.post }, { $pull: { "likes": like._id } })
    });
});

const likeModel = mongoose.model('Like', LikeSchema);

module.exports = { Like: likeModel }