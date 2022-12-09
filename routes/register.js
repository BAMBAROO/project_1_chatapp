const express = require('express')
const router = express.Router()
const registerController = require('../controllers/registerControllers')

router.get('/',notAutheticated, (req, res) => {
  res.render('../views/register.ejs', {message:'halo'})
})

router.post('/', registerController.createUser)

function notAutheticated(req,res,next){
  if(req.isAuthenticated()) {
    res.redirect('/')
  } else {
    return next()
  }
}

module.exports = router