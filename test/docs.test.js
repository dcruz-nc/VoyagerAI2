const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('ChatGPT Bot API', () => {
  it('should return a reply from the ChatGPT mock', (done) => {
    const fakeReply = "I suggest the Toyota RAV4.";

    nock('https://api.openai.com')
      .post('/v1/chat/completions')
      .reply(200, {
        choices: [{ message: { content: fakeReply } }]
      });

    chai.request(app)
      .post('/docs/api/chat')
      .send({ message: 'I want a family car with good mileage' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.reply).to.be.a('string');
        expect(res.body.reply.toLowerCase()).to.match(/recommend|suggest|consider/);
        done();
      });
  });
});


describe('Contact Form API (Discord Webhook)', () => {
  it('should send contact form to mocked Discord webhook', (done) => {
    const payload = {
      name: 'John',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Hello from the form!'
    };

    nock(process.env.DISCORD_WEBHOOK_URL)
      .post('')
      .reply(200, { ok: true });

    chai.request(app)
      .post('/docs/api/contact')
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        done();
      });
  });
});