/* eslint-disable no-plusplus */
const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('lodash');
const helper = require('./helper');
const server = require('../bin/www');

const expect = chai.expect;
chai.use(chaiHttp);

const routes = helper.routes();

describe('App', function () {
  describe('Given all the routes', () => {
    it('should not have any duplicated routes', () => {

      _.each(routes, (urls, verb) => {
        urls = urls.slice().sort();

        const results = [];

        for (let i = 0; i < urls.length - 1; i++) {
          if (urls[i + 1] === urls[i]) {
            results.push(urls[i]);
          }
        }

        expect(results, `Duplicate ${verb} route: ${results.join(',')}`).to.be.empty;
      });
    });

    it('should have google tag manager', (done) => {
      const toSkip = ['/ab/vn', '/ab', '/:a/:language/thank-you/:eligible?', '/:a/:b/:language/thank-you/:eligible?'];
      const valid = _.xor(routes.get, toSkip);
      const urlCount = valid.length - 1;

      _.each(valid, (url, index) => {
        chai.request(server).get(url).end((err, res) => {
          expect(res.text).to.match(/https:\/\/www\.googletagmanager\.com\/gtm\.js/);
          expect(res.text).to.match(/https:\/\/www\.googletagmanager\.com\/ns\.html/);
          if (urlCount === index) {
            done();
          }
        });
      });
    });
  });
});

