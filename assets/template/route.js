const express = require('express');
const path = require('path');

const router = express.Router();

const folderName = __dirname.split(path.sep).pop();
const publicFolder = `projects/${folderName}`;

router.get('/template', function (req, res) {
  res.render(`projects/${folderName}/index`, {
    publicFolder
  });
});

module.exports = router;
