require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { authenticate } = require('passport');
const {MongoClient, Db} = require('mongodb');

const uri = 'mongodb+srv://<username>:<password>@cluster0.h0q4bjt.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

function initialize(passport) {
  const authenticateUser = async(email, password, done) => {
  const db = client.db('userDB')
  const datas = db.collection('users').find({})
  const result = await datas.toArray()
  const user = result.find(person => person.email === email)
  if(user == null) {
    return done(null, false, {message: "no user with that email"})  
  }
  try {
    if(await bcrypt.compare(password, user.password)) {
      return done(null, user)
    } else {
      return done(null, false, {message: 'password is wrong'})
    }
  } catch(error) {
    done(error)
  }
};
  passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
};
async function getUserById (id) {
  const db = client.db('userDB');
  const datas = db.collection('users').find({})
  const result = await datas.toArray()
  return result.find(person => person.id === id)
};

module.exports = initialize