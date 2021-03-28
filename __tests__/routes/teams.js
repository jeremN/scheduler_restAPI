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
  let teammateId

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
              email: 'tata.yoyo@yo.fr',
              hours: 39,
              contract: 'CDI',
              poste: 'Responsable',
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

    teammateId = response.body.team.members[0]._id

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('team')
    expect(response.body.message).toBe('Team fetched.')
    expect(response.body.team.name).toBe('test team')
    expect(response.body.team.members).toHaveLength(2)
  })

  it('Should return a 404 error if teamId is incorrect', async () => {
    const badTeamId = teamId.replace(/.$/, 'az')
    const response = await supertest(app)
      .get(`/teams/team/${badTeamId}`)
      .set({
        userId: userId,
        Authorization: `bearer ${token}`,
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Please provide a valid teamId')
  })

  it("Should return a 404 error if teamId doesn't exist", async () => {
    const badTeamId = teamId.replace(/.$/, 'a')
    const response = await supertest(app)
      .get(`/teams/team/${badTeamId}`)
      .set({
        userId: userId,
        Authorization: `bearer ${token}`,
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Could not find team.')
  })

  it('Should get a teammate', async () => {
    const response = await supertest(app)
      .get(`/teams/teammate/${teamId}/${teammateId}`)
      .set('Authorization', `bearer ${token}`)
      .set('userId', userId)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('teammate')
    expect(response.body).toHaveProperty('teamName')
    expect(response.body).toHaveProperty('location')
    expect(response.body.message).toBe('Teammate fetched.')
  })

  it('Should update a teammate', async () => {
    const response = await supertest(app)
      .put(`/teams/updateTeammate/${teamId}/${teammateId}`)
      .set('Authorization', `bearer ${token}`)
      .set('Accept', 'application/json')
      .send({
        updatedTeammate: {
          firstname: 'Maud',
          lastname: 'Flanders',
          email: 'maud.flanders@doe.com',
          hours: 35,
          contract: 'CDD',
          poste: 'Vendeuse',
        },
      })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Teammate profil updated !')
    expect(response.body).toHaveProperty('updated')
    expect(response.body.updated).toBeTruthy()
  })

  it("Should return a 404 error when updating if team doesn't exist", async () => {
    const badTeamId = teamId.replace(/.$/, 'a')
    const response = await supertest(app)
      .put(`/teams/updateTeammate/${badTeamId}/${teammateId}`)
      .set('Authorization', `bearer ${token}`)
      .set('Accept', 'application/json')
      .send({
        updatedTeammate: {
          firstname: 'Maud',
          lastname: 'Flanders',
          email: 'maud.flanders@doe.com',
          hours: 35,
          contract: 'CDD',
          poste: 'Vendeuse',
        },
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Could not find teammate.')
  })

  it('Should delete a teammate', async () => {
    const response = await supertest(app)
      .delete(`/teams/deleteTeammate/${teamId}/${teammateId}`)
      .set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Teammate deleted !')
    expect(response.body).toHaveProperty('deleted')
    expect(response.body.deleted).toBeTruthy()
  })

  it("Should return a 404 error when deleting if teammate doesn't exist", async () => {
    const badTeamId = teamId.replace(/.$/, '4')
    const badTeammateId = teammateId.replace(/.$/, '4')
    const response = await supertest(app)
      .delete(`/teams/deleteTeammate/${badTeamId}/${badTeammateId}`)
      .set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Could not find teammate.')
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

  it("Should return a 404 error when updating if team doesn't exist", async () => {
    const badTeamId = teamId.replace(/.$/, 'a')
    const response = await supertest(app)
      .put(`/teams/updateTeam/${badTeamId}`)
      .set({
        userId: userId,
        Authorization: `bearer ${token}`,
        Accept: 'application/json',
      })
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

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Could not find team.')
  })

  it('Should delete team', async () => {
    const response = await supertest(app)
      .delete(`/teams/deleteTeam/${teamId}`)
      .set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Team deleted !')
  })

  it("Should return a 404 error when deleting if team doesn't exist", async () => {
    const badTeamId = teamId.replace(/.$/, 'a')
    const response = await supertest(app)
      .delete(`/teams/deleteTeam/${badTeamId}`)
      .set({
        Authorization: `bearer ${token}`,
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Could not find this team.')
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
