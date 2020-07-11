const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../server.js');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/user');
const MONGODB_URI = `${process.env.DB_TEST_URL}`;

describe('Testing User API endpoints', () => {
  let userId;
  let token;

  beforeAll((done) => {
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(async () => {
      try {
        const createUser = await supertest(app)
          .post('/auth/signup')
          .set('Accept', 'application/json')
          .send({
            email: 'team@team.com',
            password: '12345678',
            firstname: 'TeamTest'
          });

        const currentUser = await supertest(app)
          .post('/auth/login')
          .send({
            email: 'team@team.com',
            password: '12345678',
          })
          .set('Accept', 'application/json');

        userId = currentUser.body.userID;
        token = currentUser.body.token;
        done();
      } catch (e) {
        console.error(e);
        done(e);
      }
    })
    .catch((err) => {
      console.error(err);
      done(err);
    })
  })

  it('Should get the user by ID', async () => {
    const response = await supertest(app)
      .get(`/user/${userId}`)
      .set('Authorization', 'bearer ' + token)
      .set('userId', userId)
      .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User fetched.');
      expect(response.body).toHaveProperty('user');
  });  

  it('Should update the user', async () => {
    const response = await supertest(app)
      .put('/user/updateUser')
      .set('Authorization', 'bearer ' + token)
      .set('userId', userId)
      .set('Accept', 'application/json')
      .send({
        updatedUser: {
          firstname: 'updated user'
        }
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated');
  });

  it('Should delete the user', async () => {
    const response = await supertest(app)
      .delete('/user/deleteUser')
      .set('Authorization', 'bearer ' + token)
      .set('userId', userId);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted');
  });

  afterAll(async (done) => {
    try {
      await User.deleteMany()
      await mongoose.disconnect();
      done();      
    } catch (error) {
      console.error('User test error', error)
      done(error);
    }
  });
});