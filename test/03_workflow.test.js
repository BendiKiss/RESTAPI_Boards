const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Boards workflow tests', () => {



    // POST Create functional test
    it('should register + login a user, create board and verify 1 in DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Board Hardy",
            email: "mail@boards.com",
            password: "123456"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                
                // Asserts
                expect(res.status).to.be.equal(200);   
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);
               
                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@boards.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);
                        expect(res.body.error).to.be.equal(null);                        
                        let token = res.body.data.token;

                        // 3) Create new board
                        let boards =
                        {
                            name: "Test Board",
                            type: "Testing ",
                            style: "Test style",
                            description: "Testing on boards",
                            price: 100,
                            inStock: true
                        };

                        chai.request(server)
                            .post('/api/boards')
                            .set({ "auth-token": token })
                            .send(boards)
                            .end((err, res) => {
                                
                                // Asserts
                                expect(res.status).to.be.equal(201);                                
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);
                                
                                let savedBoards = res.body[0];
                                expect(savedBoards.name).to.be.equal(boards.name);
                                expect(savedBoards.type).to.be.equal(boards.type);
                                expect(savedBoards.style).to.be.equal(boards.style);
                                expect(savedBoards.description).to.be.equal(boards.description);
                                expect(savedBoards.price).to.be.equal(boards.price);
                                expect(savedBoards.inStock).to.be.equal(boards.inStock);


                                // 4) Verify one board in test DB
                                chai.request(server)
                                    .get('/api/boards')
                                    .end((err, res) => {
                                        
                                        // Asserts
                                        expect(res.status).to.be.equal(200);                                
                                        expect(res.body).to.be.a('array');                                
                                        expect(res.body.length).to.be.eql(1);
                                
                                        done();
                                    });
                            });
                    });
            });
    });

    // Valid input test (register, login, )
    it('should register + login a user, create board and delete it from DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Peter Petersen",
            email: "mail@petersen.com",
            password: "123456"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                
                // Asserts
                expect(res.status).to.be.equal(200);   
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);
                
                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@petersen.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);                         
                        expect(res.body.error).to.be.equal(null);                        
                        let token = res.body.data.token;

                        // 3) Create new board
                        let boards =
                        {
                            name: "Test Board",
                            type: "Testing ",
                            style: "Test style",
                            description: "Testing on boards",
                            price: 100,
                            inStock: true
                        };

                        chai.request(server)
                            .post('/api/boards')
                            .set({ "auth-token": token })
                            .send(boards)
                            .end((err, res) => {
                                
                                // Asserts
                                expect(res.status).to.be.equal(201);                                
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);
                                
                                let savedBoards = res.body[0];
                                expect(savedBoards.name).to.be.equal(boards.name);
                                expect(savedBoards.type).to.be.equal(boards.type);
                                expect(savedBoards.style).to.be.equal(boards.style);
                                expect(savedBoards.description).to.be.equal(boards.description);
                                expect(savedBoards.price).to.be.equal(boards.price);
                                expect(savedBoards.inStock).to.be.equal(boards.inStock);

                                // 4) Delete boards
                                chai.request(server)
                                    .delete('/api/boards/' + savedBoards._id)
                                    .set({ "auth-token": token })
                                    .end((err, res) => {
                                        
                                        // Asserts
                                        expect(res.status).to.be.equal(200);                                        
                                        const actualVal = res.body.message;
                                        expect(actualVal).to.be.equal('Board was successfully deleted.');        
                                        done();
                                    });
                                    
                            });
                    });
            });
    });
    

    // Invalid input test
    it('invalid user input test', (done) => {

        // 1) Register new user with invalid inputs
        let user = {
            name: "Board Hardy",
            email: "mail@boards.com",
            password: "123" //Faulty password - Joi/validation should catch this...
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                                
                // Asserts
                expect(res.status).to.be.equal(400); //normal expect with no custom output message
                //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail
                
                expect(res.body).to.be.a('object');
                expect(res.body.error.message).to.be.equal("\"password\" length must be at least 6 characters long");  
                done();              
            });
    });
    
});