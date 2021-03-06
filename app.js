const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

const envs = dotenv.config()

if (envs.error) {
  throw envs.error
}

// ROUTES
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const teamRoutes = require('./routes/teams')
const planningsRoutes = require('./routes/plannings')

const app = express()

// MONGO DB URI
const MONGODB_URI = `${process.env.DB_DEV_URL}`
const CONNECT_CFG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

app.use(bodyParser.json())

// APP USE
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, DELETE',
  )
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next()
})

app.use(cors())
app.options('*', cors())

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/teams', teamRoutes)
app.use('/plannings', planningsRoutes)

app.use((error, req, res, next) => {
  console.debug('app.js error', error, req)
  const status = error.statusCode || 500
  const {message, data} = error
  console.debug('error middleware', status, message)
  res.status(status).json({
    message,
    data,
  })
})

// MONGODB CONNECT
mongoose
  .connect(MONGODB_URI, CONNECT_CFG)
  .then(() => {
    app.listen(process.env.PORT || 8080)
  })
  .catch(err => console.error(err))

exports.app = app
