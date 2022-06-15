const express= require('express');
const router = express.Router();

const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })

const posts = require('../controllers/posts')

const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validatePost } = require('../middleware')

// Routes
// C - Place before posts/:id
router.get('/posts/create', isLoggedIn, posts.renderCreate)

router.post('/', isLoggedIn, upload.single(('image')), validatePost, catchAsync(posts.create))


// R
router.get('/', catchAsync(posts.renderIndex))

router.get('/posts/:id', catchAsync(posts.renderShow))


// U
router.get('/posts/:id/update', isLoggedIn, isAuthor, catchAsync(posts.renderUpdate))

router.put('/posts/:id', isLoggedIn, isAuthor, upload.single(('image')), validatePost, catchAsync(posts.update))


// D
router.delete('/posts/:id', isLoggedIn, isAuthor, catchAsync(posts.delete))

module.exports = router