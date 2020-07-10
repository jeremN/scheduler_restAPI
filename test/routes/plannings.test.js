const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../server.js');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/user');
const Planning = require('../../models/plannings');
const MONGODB_URI = `${process.env.DB_TEST_URL}`;

describe('Testing Plannings API endpoints', () => {
  let userId;
  let token;
  let planningId;

  beforeAll((done) => {
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(async () => {
      const createUser = await supertest(app)
        .post('/auth/signup')
        .send({
          email: 'plannings@plannings.com',
          password: '12345678',
          firstname: 'plannings test'
        })
        .set('Accept', 'application/json');

      const currentUser = await supertest(app)
        .post('/auth/login')
        .send({
          email: 'plannings@plannings.com',
          password: '12345678',
        })
        .set('Accept', 'application/json');

      userId = currentUser.body.userID;
      token = currentUser.body.token;
      done();
    })
    .catch((err) => {
      console.error(err);
      done(err);
    });  

  });

  it('Should create a planning', async () => {
    const response = await supertest(app)
      .post('/plannings/newPlanning')
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + token)
      .set('userId', userId)
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
      });

    planningId = response.body.planningID;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('planningID');
    expect(response.body.message).toBe('New planning created !');
  });
  
  it('Should send an error if the planningID does not exist', async () => {
    const newId = `${planningId}`
    const response = await supertest(app)
      .get(`/plannings/planning/${newId.replace(/.$/,"z")}`)
      .set('Authorization', 'bearer ' + token)
      .set('userId', userId);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Could not find planning.');
  });

  it('Should get the created planning', async () => {
    const response = await supertest(app)
      .get(`/plannings/planning/${planningId}`)
      .set('Authorization', 'bearer ' + token)
      .set('userId', userId);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('planning');
    expect(response.body.message).toBe('Planning fetched.');
    expect(response.body.planning.title).toBe('Testing');
  });

  it('Should duplicate a planning', async () => {
    const response = await supertest(app)
      .post('/plannings/duplicate')
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + token)
      .set('userId', userId)
      .send({ 
        planningID: planningId,
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('newID');
    expect(response.body.message).toBe('Planning duplicated !');
  });
  
  it('Should update planning', async () => {
    const response = await supertest(app)
      .put(`/plannings/editPlanning/${planningId}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + token)
      .set('userId', userId)
      .send({
        updatedPlanning: {
          title: 'Test update',
          startHours: '9h00', 
          endHours: '20h30',
          status: 'published'
        },
        userId: userId
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Planning updated');
    expect(response.body).toHaveProperty('planning');
    expect(response.body.planning.title).toBe('Test update');
  });

  
  it('Should delete planning', async () => {
    const response = await supertest(app)
      .delete(`/plannings/deletePlanning/${planningId}`)
      .set('Authorization', 'bearer ' + token)
      .set('userId', userId);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Planning deleted !');
  });

  afterAll(async (done) => {
    try {
      await Planning.deleteMany();
      await User.findByIdAndRemove(userId)
      await mongoose.disconnect();
      done();
    } catch (error) {
      console.error('Plannings test error', error)
      done(error);
    }
  });
});
