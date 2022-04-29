const User = require('../models/user');
const Post = require('../models/post');

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
    const posts = await Post.find({author: req.params.id}).sort({ createdOn: 'desc'}).populate('author');

    let createdOnDaysAgo = []
    let modifiedOnDaysAgo = []

    const calcDaysAgo = (date) => {
        let daysAgo = Math.round(Math.abs((date - new Date()) / (24 * 60 * 60 * 1000)));
        if (daysAgo === 0) {
            return "today"
        }
        if (daysAgo === 1) {
            return "yesterday"
        }
        return daysAgo
    }

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        createdOnDaysAgo.push(calcDaysAgo(post.createdOn));
        modifiedOnDaysAgo.push(calcDaysAgo(post.modifiedOn));
    }


    res.render('users/profile', { profile, posts, createdOnDaysAgo, modifiedOnDaysAgo });
}