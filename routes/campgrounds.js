const router = require('express').Router(),
  Campground = require('../models/campground'),
  { isLoggedIn, isCampOwner } = require('../middleware')

//INDEX - show all campgrounds
router.get("/", (req, res) => {
  // Get all campgrounds from DB
  Campground.find({})
    .then(campgrounds => res.render('campgrounds/index', { campgrounds }))
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/landing')
    })
});

// NEW - show form to create new campground
router.get("/new", isLoggedIn, (req, res) => res.render("campgrounds/new"));

//CREATE - add new campground to DB
router.post("/", isLoggedIn, (req, res) => {
  // Create a new campground and save to DB
  Campground.create({
      ...req.body.camp,
      owner: {
        id: req.user._id,
        username: req.user.username
      }
    })
    .then(campground => {
      req.flash('success', 'Campground created')
      res.redirect('/campgrounds')
    })
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds')
    })
});

// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate('comments').exec()
    .then(campground => {
      res.render("campgrounds/show", { campground })
    })
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds')
    })
})

// EDIT - Form to update campground
router.get('/:id/edit', isLoggedIn, isCampOwner, (req, res) => {
  Campground.findById(req.params.id)
    .then(campground => res.render('campgrounds/edit', { campground }))
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds')
    })
})

// UPDATE
router.put('/:id', isLoggedIn, isCampOwner, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.camp)
    .then(camp => {
      req.flash('success', 'Campground updated')
      res.redirect('/campgrounds/' + req.params.id)
    })
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds/' + req.params.id)
    })
})

// DELETE
router.delete('/:id', isLoggedIn, isCampOwner, (req, res) => {
  Campground.findByIdAndRemove(req.params.id)
    .then(camp => {
      req.flash('success', 'Campground deleted')
      res.redirect('/campgrounds')
    })
    .catch(err => {
      req.flash('error', err.message)
      res.redirect('/campgrounds/' + req.params.id)
    })
})

module.exports = router
