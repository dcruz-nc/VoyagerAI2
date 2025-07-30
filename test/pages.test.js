const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Public Page Accessibility', () => {
  const publicPages = [
    { path: '/', keyword: 'Smarter Car Rentals' },
    { path: '/docs/faq', keyword: 'Frequently Asked Questions' },
    { path: '/docs/mission', keyword: 'Driving the Future' },
    { path: '/docs/policies', keyword: 'Policies' },
    { path: '/docs/support', keyword: 'Customer Support' },
    { path: '/rentals/browse', keyword: 'Explore Vehicles' },
  ];

  publicPages.forEach(({ path, keyword }) => {
    it(`should return 200 and contain "${keyword}" for ${path}`, (done) => {
      chai.request(app)
        .get(path)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.include(keyword);
          done();
        });
    });
  });
});
