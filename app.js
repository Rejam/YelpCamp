var express = require("express"),
  mongoose = require("mongoose"),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  bodyParser = require("body-parser"),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  User = require('./models/user'),
  seedDB = require('./seed')

const indexRoutes = require('./routes/index')
const campgroundRoutes = require('./routes/campgrounds')
const commentRoutes = require('./routes/comments')

// MONGOOSE CONFIG
mongoose.connect("mongodb://localhost/yelp_camp");

// EXPRESS CONFIG
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())

//seedDB()

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: 'Campus North',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

app.listen(process.env.PORT, process.env.IP, _ =>
  console.log("The YelpCamp Server Has Started!"))
