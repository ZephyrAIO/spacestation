const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = require('./comment')


const { Like } = require('./like')
const { Dislike } = require('./dislike')


const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        url: String,
        filename: String
    },
    title: String,
    text: String,
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Dislike'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

PostSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
        await Like.deleteMany({
            _id: {
                $in: doc.likes
            }
        })
        await Dislike.deleteMany({
            _id: {
                $in: doc.dislike
            }
        })
    }
})

module.exports = mongoose.model('Post', PostSchema);