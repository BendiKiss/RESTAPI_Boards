//process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.use(chaiHttp);


describe('/First Test Collection', function () {

    it ('test default API welcome route...', (done) => {

        chai.request(server)
        .get('/api/welcome')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal('Welcome to the MEN RESTful API');
            expect()

            done();
        });
    });

    it('should verify that we have 0 boards in the DB', (done) => {

        chai.request(server)
        .get('/api/boards')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.a('array');
            res.body.length.should.be.equal(0);

            done();
        });

    });

    it('should post valid board', (done) => {

        let board = {
            name: "Test Board",
            type: "Testing ",
            description: "Testing on boards",
            price: 100,
            inStock: true
      }

        chai.request(server)
        .post('/api/boards')
        .send(board)
        .end((err, res) => {
            res.should.have.status(201);
            done();
        });

    });

    it('should verify that we have 1 boards in the DB', (done) => {

        chai.request(server)
        .get('/api/boards')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.a('array');
            res.body.length.should.be.equal(1);

            done();
        });

    });


    it (' should test two values....', function () {
        //actual test content in here 
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);
    })
})

