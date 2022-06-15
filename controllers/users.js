const User = require('../models/user');
const Post = require('../models/post');
const moment = require('moment');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        const redirectUrl = req.session.returnTo || '/';
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Greetings ${username}`);
            res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    const { username } = req.user;
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    const { username } = req.user;
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    req.logout();
    res.redirect(redirectUrl);
}

module.exports.renderProfile = async (req, res) => {
    const profile = await User.findById(req.params.id);
    const posts = await Post.find({author: req.params.id}).sort({ createdOn: 'desc'}).populate('author').populate('likes');
    res.render('users/profile', { profile, posts, moment: moment });
}