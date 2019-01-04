const auth = require('http-auth');

module.exports = auth.basic({
  realm: 'rhb',
}, (username, password, callback) => {
  callback(true);
  // callback(username === process.env.username && password === process.env.password);
});
