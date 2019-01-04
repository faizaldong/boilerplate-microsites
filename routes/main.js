const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();


try {
  fs.readdirSync(path.join(__dirname, '/../assets/projects')).forEach(function (project) {
    // eslint-disable-next-line
    router.use('/', require(`../assets/projects/${project}/route.js`));
  });
} catch (err) {
  console.log(err);
}


module.exports = router;
