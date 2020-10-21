const dotenv = require('dotenv')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../server.js')

dotenv.config()

const User = require('../../models/user')

const MONGODB_URI = `${process.env.DB_TEST_URL}`

describe('Testing Auth API endpoints', () => {
  beforeAll(done => {
    mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('Should create a new user', async () => {
    const response = await supertest(app)
      .post('/auth/signup')
      .send({
        firstname: 'auth test',
        email: 'auth@auth.fr',
        password: '12345678',
      })
      .set('Accept', 'application/json')

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User created')
    expect(response.body).toHaveProperty('userID')
  })

  it('Should log the user in', async () => {
    const response = await supertest(app)
      .post('/auth/login')
      .send({
        email: 'auth@auth.fr',
        password: '12345678',
      })
      .set('Accept', 'application/json')

    // const userId = response.body.userID

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('userID')
    expect(response.body).toHaveProperty('token')
  })

  afterAll(async done => {
    try {
      await User.deleteMany()
      await mongoose.disconnect()
      done()
    } catch (error) {
      done(error)
    }
  })
})
