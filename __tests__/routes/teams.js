const supertest = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('../../tests/server.js')

dotenv.config()

const User = require('../../models/user')
const Team = require('../../models/teams')

const MONGODB_URI = `${process.env.DB_TEST_URL}`

describe('Testing Team API endpoints', () => {
  let userId
  let teamId
  let token

  beforeAll(done => {
    mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        try {
          await supertest(app)
            .post('/auth/signup')
            .set('Accept', 'application/json')
            .send({
              email: 'team@team.com',
              password: '12345678',
              firstname: 'TeamTest',
            })

          const currentUser = await supertest(app)
            .post('/auth/login')
            .send({
              email: 'team@team.com',
              password: '12345678',
            })
            .set('Accept', 'application/json')

          userId = currentUser.body.userID
          token = currentUser.body.token
          done()
        } catch (e) {
          done(e)
        }
      })
      .catch(err => {
        done(err)
      })
  })

  it('Should create a team', async () => {
    const response = await supertest(app)
      .post('/teams/newTeam')
      .set('Authorization', `bearer ${token}`)
      .set('userId', userId)
      .set('Accept', 'application/json')
      .send({
        newTeam: {
          name: 'test team',
          location: {
            city: 'Aubergenville',
          },
          members: [
            {
              firstname: 'Tata',
              lastname: 'Yoyo',
            },
            {
              firstname: 'John',
              lastname: 'Doe',
            },
          ],
        },
      })

    teamId = response.body.newTeamID

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('newTeamID')
    expect(response.body.message).toBe('New team created !')
  })

  it('Should get the created team', async () => {
    const response = await supertest(app)
      .get(`/teams/team/${teamId}`)
      .set('Authorization', `bearer ${token}`)
      .set('userId', userId)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('team')
    expect(response.body.message).toBe('Team fetched.')
    expect(response.body.team.name).toBe('test team')
  })

  it('Should update team', async () => {
    const response = await supertest(app)
      .put(`/teams/updateTeam/${teamId}`)
      .set('Authorization', `bearer ${token}`)
      .set('userId', userId)
      .set('Accept', 'application/json')
      .send({
        updatedTeam: {
          name: 'test first team 2 - updated',
          members: [
            {
              firstname: 'Tonton',
              lastname: 'Yaya',
            },
            {
              firstname: 'John',
              lastname: 'Doe',
            },
          ],
        },
      })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Team updated')
    expect(response.body).toHaveProperty('team')
    expect(response.body.team.name).toBe('test first team 2 - updated')
  })

  it('Should delete team', async () => {
    const response = await supertest(app)
      .delete(`/teams/deleteTeam/${teamId}`)
      .set('Authorization', `bearer ${token}`)
      .set('userId', userId)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Team deleted !')
  })

  afterAll(async done => {
    try {
      await Team.deleteMany()
      await User.deleteMany()
      await mongoose.disconnect()
      done()
    } catch (error) {
      done(error)
    }
  })
})
