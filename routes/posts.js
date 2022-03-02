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
router.get('/new', isLoggedIn, posts.renderCreate)

router.post('/', isLoggedIn, upload.single(('image')), validatePost, catchAsync(posts.create))


// R
router.get('/', catchAsync(posts.renderIndex))

router.get('/:id', catchAsync(posts.renderShow))


// U
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.renderUpdate))

router.put('/:id', isLoggedIn, isAuthor, upload.single(('image')), validatePost, catchAsync(posts.update))


// D
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(posts.delete))


module.exports = router