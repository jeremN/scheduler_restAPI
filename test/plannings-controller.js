/* const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');
const PlanningsController = require('../controller/plannings');


describe('Plannings controller', function () {
  let userId;

  beforeAll(function (done) {
    const MONGODB_URI = `${process.env.MONGO_URI}`;
    const CONNECT_CFG = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    mongoose.connect(MONGODB_URI, CONNECT_CFG)
      .then( async () => {
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
          console.error(e);
          done(e);
        }
      })
      .catch((err) => {
        console.error(err);
        done(err);
      });  
  });

  it('should create a planning and add it to the plannings of the creator', function (done) {
    const req = {
      body: {
        newPlanning: {
          title: 'Testing',
          shop: 'Aubergenville', 
          startDate: '08/06/2020',
          endDate: '14/06/2020',
          startHours: '8h30', 
          endHours: '20h30',
          status: 'wip'
        },
      },
      userId: userId
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {}
    };

    PlanningsController.createPlanning(req, res, () => {})
      .then((response) => {
        expect(response).toHaveProperty('planningID');
        expect(response.total).toEqual(1);
        done();
      })
      .catch((e) => {
        console.error(e);
        done(e);
      });
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
*/
