const mongoose = require('mongoose');
const seeddata = require('./seed-data')


// Models
const Post = require('../models/post')


// Mongoose connection
mongoose.connect('mongodb://localhost:27017/spacestation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Post.deleteMany({});
    for (let i = 0; i < 4; i++) {
        const rand30 = Math.floor(Math.random() * 30)
        let postData = seeddata[rand30];
        postData.author = "6213529b7e79bee1f2007579"
        const post = new Post(postData)
        await post.save()
    }
}

seedDB();