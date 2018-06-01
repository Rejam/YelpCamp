const router = require('express').Router({ mergeParams: true }),
  Comment = require('../models/comment'),
  Campground = require('../models/campground'),
  { isLoggedIn, isCommentOwner } = require('../middleware')

// NEW - show form to create new comment
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render('comments/new', { campground }))
})

// CREATE - new comment
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => Comment.create({
        text: req.body.text,
        author: {
          id: req.user._id,
          username: req.user.username
        }
      })
      .then(comment => {
        camp.comments.push(comment)
        camp.save()
        req.flash('success', 'Your comment has been saved')
        res.redirect('/campgrounds/' + req.params.id)
      }))
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('back')
    })
})

// Edit
router.get('/:comment_id/edit', isCommentOwner, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => Comment.findById(req.params.comment_id)
      .then(comment => res.render('comments/edit', { comment, campground }))
    )
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds/' + req.params.id)
    })
})

// Update
router.put('/:comment_id', isCommentOwner, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, { text: req.body.text })
    .then(comment => {
      req.flash('success', ' Your comment has been updated')
      res.redirect('/campgrounds/' + req.params.id)
    })
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds/' + req.params.id)
    })
})

// Delete
router.delete('/:comment_id', isCommentOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id)
    .then(comment => {
      req.flash('success', 'Your comment has been deleted')
      res.redirect('/campgrounds/' + req.params.id)
    })
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds/' + req.params.id)
    })
})

module.exports = router
