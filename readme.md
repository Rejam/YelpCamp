# YelpCamp

## Install auth packages
- express-session
- passport
- passport-local
- passport-local-mongoose

## express-session
app.js
``` 
app.use(require('express-session')({
  secret: "the french open",
  resave: false,
  saveUninitialized: false
}))
```

## passport
app.js
```
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
...
app.post('/login', passport.authenticate("local", {
  successRedirect: '/secret',
  failureRedirect: '/login'
}))
```

## passport-local
app.js
```
const LocalStrategy = require('passport-local')
...
passport.use(new LocalStrategy(User.authenticate()))
...
app.post('/login', passport.authenticate("local", {
  successRedirect: '/secret',
  failureRedirect: '/login'
}))
```

## passport-local-mongoose
model (e.g user.js)
```
userSchema.plugin(passportLocalMongoose)
```

