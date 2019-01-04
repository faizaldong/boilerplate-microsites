const fs = require('fs');
const express = require('express');
const _ = require('lodash');

const router = express.Router();

module.exports = {
  routes() {
    fs.readdirSync('./assets/projects').forEach(function (project) {
      const routeStack = require(`../assets/projects/${project}/route.js`).stack;
      routeStack.forEach((route) => {
        router.stack.push(route);
      });
    });

    const verbs = {
      get: [],
      post: [],
      put: [],
      patch: [],
      head: [],
      delete: []
    };

    router.stack.forEach(function (layer) {
      let currentVerb = false;
      _.each(layer.route.methods, (value, method) => {
        if (!currentVerb) {
          currentVerb = method;
        }
      });

      if (Array.isArray(layer.route.path)) {
        layer.route.path.forEach((url) => {
          verbs[currentVerb].push(url);
        });
      } else {
        verbs[currentVerb].push(layer.route.path);
      }
    });

    return verbs;
  }
};
