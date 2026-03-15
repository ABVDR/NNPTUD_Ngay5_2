const mongoose = require('mongoose');
const userModel = require('./schemas/users');
const bcrypt = require('bcrypt');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/NNPTUD-C3');
    const u = await userModel.findOne({ username: 'user2' });
    console.log('found', !!u);
    if (u) {
      console.log('username', u.username);
      console.log('hash', u.password);
      console.log('compare Abcd1234!', bcrypt.compareSync('Abcd1234!', u.password));
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
})();
