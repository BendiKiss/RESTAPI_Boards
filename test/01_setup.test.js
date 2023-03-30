process.env.NODE_ENV = 'test';

const boards = require('../models/boards');
const User = require('../models/user');


//clean up the database before and after each test
beforeEach((done) => { 
    boards.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});

afterEach((done) => {
    boards.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});