const bcrypt = require('bcrypt');
const {MongoClient} = require('mongodb');

const uri = 'mongodb+srv://<username>:<password>@cluster0.h0q4bjt.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri)

async function createUser (req, res) {
  const {username,email, password} = req.body;
  const id = Date.now().toString()
  console.log({id,username,email,password})
  const db = client.db('userDB')
  const datas = db.collection('users').find({})
  const result = await datas.toArray()

  const usedByEmail = result.find(person => person.email === email)
  const usedByUsername = result.find(person => person.username === username)
  if(usedByEmail || usedByUsername) {
    return res.render('../views/register.ejs', {message:'username/email already exist'})
  } else {
  try {
    const hashedPassword = await bcrypt.hash(password,10)
    console.log(hashedPassword)
    const newUser = {"id":id,"username":username,"email":email,"password":hashedPassword}
    db.collection('users').insertOne(newUser)
    res.redirect("/login")
  } catch (err) {
  res.status(500).json({"message" : err.message})
  }
  }
}
module.exports = {createUser}