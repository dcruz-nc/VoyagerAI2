const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/user');
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Registration', () => {
  // Clear test user before each test
  beforeEach(async () => {
    await User.deleteOne({ email: 'testuser@example.com' });
  });

    it('should register a new user with valid data', (done) => {
    chai.request(app)
        .post('/users')
        .type('form')
        .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'password123'
        })
        .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.redirects[0]).to.include('/users/login');
        done();
        });
    });
});

describe('User Login', () => {
    before(async () => {
    // Ensure test user exists in DB
    await User.deleteOne({ email: 'testuser@example.com' });
    await new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'password123'
    }).save();
    });

    it('should log in a user with correct credentials', (done) => {
    chai.request(app)
        .post('/users/login')
        .type('form')
        .send({
        email: 'testuser@example.com',
        password: 'password123'
        })
        .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.redirects[0]).to.include('/users/profile');
        done();
        });
    });

    it('should NOT log in with incorrect password', (done) => {
    chai.request(app)
        .post('/users/login')
        .type('form')
        .send({
        email: 'testuser@example.com',
        password: 'wrongpassword'
        })
        .end((err, res) => {
        expect(res).to.have.status(200); // still returns a page
        expect(res.redirects[0]).to.include('/users/login');
        done();
        });
    });
});

describe('Protected Route Access', () => {
  it('should block access to profile when not logged in', (done) => {
    chai.request(app)
      .get('/users/profile')
      .end((err, res) => {
        expect(res).to.have.status(200); 
        expect(res.redirects[0]).to.include('/users/login');
        done();
      });
  });
});

describe('Authenticated Access', () => {
  const agent = chai.request.agent(app);

    before(async () => {
    await User.deleteOne({ email: 'agenttest@example.com' });
    await new User({
        firstName: 'Agent',
        lastName: 'Tester',
        email: 'agenttest@example.com',
        password: 'password123'
    }).save();
    });

    it('should allow access to /users/profile after login', (done) => {
        agent
        .post('/users/login')
        .type('form')
        .send({ email: 'agenttest@example.com', password: 'password123' })
        .end((err, res) => {
        agent
            .get('/users/profile')
            .end((err2, res2) => {
            expect(res2).to.have.status(200);
            expect(res2.text).to.include('Welcome, Agent Tester');
            done();
            });
        });
    });


    it('should allow access to /rentals after login', (done) => {
        agent
        .post('/users/login')
        .type('form')
        .send({ email: 'agenttest@example.com', password: 'password123' })
        .end((err, res) => {
        agent
            .get('/rentals')
            .end((err2, res2) => {
            expect(res2).to.have.status(200);
            expect(res2.text).to.include('Your Rentals');
            done();
            });
        });
    });

});