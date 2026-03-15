const userController = require('./controllers/users');
(async ()=>{
  const token = await userController.QueryLogin('user2', 'Abcd1234!');
  console.log('token', token);
})();
