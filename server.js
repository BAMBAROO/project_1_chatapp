require('dotenv').config()
const express = require('express')
const BodyParser = require('body-parser')
const methodOverride = require('method-override')
const app = express()
const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')
const port = process.env.PORT || 3000

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const initializePassport = require('./passportConfig');
initializePassport(passport)
    
app.use(BodyParser.urlencoded({extended:false}))
app.use(express.static('public'))
app.set('views', 'views')
app.set('view-engine','ejs')
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/chat'))
app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))

app.delete('/logout', (req,res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  })
})

io.on("connection", (socket) => {
  socket.on("message", data => {
    console.log(data)
    socket.broadcast.emit("messages", data)
  })
})

server.listen(port,() => {
  console.log(`Server running at PORT : ${port}`)
})