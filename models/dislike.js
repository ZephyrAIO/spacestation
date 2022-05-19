const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user')
const Post = require('./post')


const DislikeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
})


DislikeSchema.pre('deleteMany', async function () {
    let deletedLikes = await DislikeModel.find(this._conditions);
    deletedLikes.forEach(async (dislike) => {
        // pull like._id from like.user
        const updatedUser = await User.updateOne({ _id: dislike.user }, { $pull: { "dislikes": dislike._id } })
        // const updatedPost = await Post.updateOne({ _id: like.post }, { $pull: { "likes": like._id } })
    });
});


const dislikeModel = mongoose.model('Dislike', DislikeSchema);

module.exports = { Dislike: dislikeModel }