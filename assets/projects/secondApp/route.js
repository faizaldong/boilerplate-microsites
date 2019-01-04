const express = require('express');
const path = require('path');

const router = express.Router();

const folderName = __dirname.split(path.sep).pop();
const publicFolder = `projects/${folderName}`;

console.log(publicFolder);

router.get('/secondApp', function (req, res) {
  res.render(`projects/${folderName}/index`, {
    publicFolder
  });
});

module.exports = router;
