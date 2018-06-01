const router = require('express').Router(),
  passport = require('passport'),
  User = require('../models/user'),
  isLoggedIn = require('../middleware')

router.get("/", function(req, res) {
  res.render("landing");
});

// AUTH ROUTES
// Sign Up
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username })
  User.register(newUser, req.body.password)
    .then(user => {
      passport.authenticate('local')(req, res, () => {
        res.redirect('back')
      })
    })
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/login')
    })
})

// Login
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: ('/campgrounds'),
  successFlash: 'Successfully logged in',
  failureRedirect: '/login',
  failureFlash: true
}))

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You have been logged out')
  res.redirect('/campgrounds')
})

module.exports = router
