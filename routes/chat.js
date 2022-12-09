const express = require('express');
const router = express.Router();
const userLogin = require('../controllers/chat')

router.get('/',checkAuthenticated, userLogin.login)

router.post('/', (req, res) => {
  res.render('../views/chat.ejs')
})

function checkAuthenticated(req,res,next) {
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}
module.exports = router