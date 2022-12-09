async function login(req,res){
  const username = await req.user;
  res.render('../views/chat.ejs',{name: username.username})
}

module.exports = {login}