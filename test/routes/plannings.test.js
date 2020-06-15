const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../server.js');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/user');
const MONGODB_URI = `${process.env.DB_TEST_URL}`;

describe('Testing Plannings API endpoints', () => {
  let userId;
  let planningId;

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

  it('Should create a planning', async () => {
    const response = await supertest(app)
      .post('/plannings/newPlanning')
      .send({
        newPlanning: {
          title: 'Testing',
          shop: 'Aubergenville', 
          startDate: '08/06/2020',
          endDate: '14/06/2020',
          startHours: '8h30', 
          endHours: '20h30',
          status: 'wip'
        },
        userId: userId
      })
      .set('Accept', 'application/json');

    planningId = response.body.planningID;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('planningID');
    expect(response.body.message).toBe('New planning created !');
  });

  it('Should get the created planning', async () => {
    const response = await supertest(app).get(`/plannings/planning/${planningId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('planning');
    expect(response.body.message).toBe('Planning fetched.');
    expect(response.body.planning.title).toBe('Testing');
  });

  it('Should duplicate a planning', async () => {
    const response = await supertest(app)
      .post('/plannings/duplicate')
      .send({ 
        planningID: planningId,
        userId: userId
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('newID');
    expect(response.body.message).toBe('Planning duplicated !');
  });

  /* it('Should send an error if the planningID does not exist', async () => {
    const response = await supertest(app).get('/plannings/planning/154983absc');

    expect(response.status).toBe(404);
    expect(response.message).toBe('Could not find planning.');
  }); */

  it('Should update planning', async () => {
    const response = await supertest(app)
      .put(`/plannings/editPlanning/${planningId}`)
      .send({
        updatedPlanning: {
          title: 'Test update',
          startHours: '9h00', 
          endHours: '20h30',
          status: 'published'
        },
        userId: userId
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Planning updated');
    expect(response.body).toHaveProperty('planning');
    expect(response.body.planning.title).toBe('Test update');
  });

  
  it('Should delete planning', async () => {
    const response = await supertest(app).delete(`/plannings/deletePlanning/${planningId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Planning deleted !');
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
