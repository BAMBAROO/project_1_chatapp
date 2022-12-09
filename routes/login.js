const express = require('express');
const passport = require('passport');
const router = express.Router()

router.get('/', checkAuthentication, (req, res) => {
  res.render('../views/login.ejs', {name:'bryan'})
})

router.post('/', passport.authenticate('local', {
  successRedirect:'/',
  failureRedirect:'/login',
  failureFlash:true,
}))

function checkAuthentication(req,res,next) {
  if(req.isAuthenticated()) {
    res.redirect('/')
  } else {
    next()
  }
}
module.exports = router