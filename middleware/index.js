const Campground = require('../models/campground'),
  Comment = require('../models/comment')

// MIDDLEWARE
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error', 'You must be logged in to do that')
  res.redirect('/login')
}

const isCampOwner = (req, res, next) => {
  Campground.findById(req.params.id)
    .then(camp => {
      if (!camp) {
        req.flash('error', 'Campground not found')
        res.redirect('/campgrounds')
      }
      if (camp.owner.id.equals(req.user._id)) {
        return next()
      }
      req.flash('error', "You don't have permission to do that")
      res.redirect('/campgrounds/' + camp._id)
    })
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds')
    })
}

const isCommentOwner = (req, res, next) => {
  Comment.findById(req.params.comment_id)
    .then(comment => {
      if (!comment) {
        req.flash('error', 'Comment not found')
        res.redirect('/campgrounds/' + req.params.id)
      }
      if (comment.author.id.equals(req.user._id)) {
        next()
      }
      req.flash('You do not have permission to do that')
      res.redirect('/campgrounds/' + req.params.id)
    })
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds/' + req.params.id)
    })
}

module.exports = { isLoggedIn, isCampOwner, isCommentOwner }
