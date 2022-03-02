const express= require('express');
const router = express.Router({ mergeParams: true });

const comments = require('../controllers/comments')

const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isCommentAuthor, validateComment } = require('../middleware')

// COMMENTS
// C
router.post('/', isLoggedIn, validateComment, catchAsync(comments.create))

// R - Handled by POST Read

// U

// D
router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.delete))

module.exports = router