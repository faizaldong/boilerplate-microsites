/* jshint esversion: 6 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const auth = require('http-auth');
const basic = require('./lib/auth');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('view cache', process.env.view_cache === 'true');

if (process.env.view_pretty === 'true') {
  app.locals.pretty = true;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(csrf({ cookie: true }));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.basicAuth === 'true') {
  console.log('hit');
  app.use(auth.connect(basic));
}

app.get('/template', (req, res) => {
  res.render('template/index', {
    publicFolder: 'template'
  });
});

app.use('/', routes.main);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
