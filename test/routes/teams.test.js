const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../server.js');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/user');
const MONGODB_URI = `${process.env.DB_TEST_URL}`;

describe('Testing Team API endpoints', () => {
  let userId;
  let teamId;

  beforeAll((done) => {
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(async () => {
      try {
        const mockUser = new User({
          email: 'test@test.com',
          password: 'tester',
          firstname: 'Test'
        });
        const savedUser = await mockUser.save();
        userId = savedUser._id;
        done();
      } catch (e) {
        console.error(err);
        done(err);
      }
    })
    .catch((err) => {
      console.error(err);
      done(err);
    });  

  });

  it('Should create a team', async () => {
    const response = await supertest(app)
      .post('/teams/newTeam')
      .send({
        "newTeam": {
          "name": "test team",
          "location": {
            "city": "Aubergenville"
          }, 
          "members": [
            {
              "firstname": "Tata",
              "lastname": "Yoyo"
            }, 
            {
              "firstname": "John",
              "lastname": "Doe"
            }
          ]
        },
        userId: userId
      })
      .set('Accept', 'application/json');

      teamId = response.body.teamID;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('teamID');
    expect(response.body.message).toBe('New team created !');
  });

  it('Should get the created team', async () => {
    const response = await supertest(app).get(`/teams/team/${teamId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('team');
    expect(response.body.message).toBe('Team fetched.');
    expect(response.body.team.title).toBe('test team');
  });

  /* it('Should send an error if the planningID does not exist', async () => {
    const response = await supertest(app).get('/plannings/planning/154983absc');

    expect(response.status).toBe(404);
    expect(response.message).toBe('Could not find planning.');
  }); */

  it('Should update planning', async () => {
    const response = await supertest(app)
      .put(`/teams/updateTeam/${teamId}`)
      .send({
        "updatedTeam": {
          "name": "test first team 2 - updated",
          "members": [
            {
              "firstname": "Tonton",
              "lastname": "Yaya"
            },
            {
              "firstname": "John",
              "lastname": "Doe"
            }
          ]
        },
        userId: userId
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Team updated');
    expect(response.body).toHaveProperty('team');
    expect(response.body.team.title).toBe('test first team 2 - updated');
  });

  
  it('Should delete team', async () => {
    const response = await supertest(app).delete(`/teams/deleteTeam/${teamId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Team deleted !');
  });

  afterAll(function (done) {
    User.findByIdAndRemove(userId)
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch((e) => {
        console.error(e); 
        done(e);
      });
  });
});
