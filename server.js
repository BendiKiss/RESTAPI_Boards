const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

require("dotenv-flow").config();



//cors solution
const cors = require('cors');
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

//swagger deps
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

//setup Swagger
const swaggerDefinition = YAML.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));


//import routes
const boardsRoutes = require("./routes/boards");
const authRoutes = require("./routes/auth");

//routes
app.get("/api/welcome", (req, res) => {

    res.status(200).send({message: "Welcome to the MEN RESTful API"});

})


// parse request of content type JSON
app.use(bodyParser.json());


mongoose.set('strictQuery', true);
mongoose.connect
(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }
).catch(error => console.log("Error connecting to MOngoDB:" + error));

mongoose.connection.once("open", () => console.log("Connected successfully to MongoDB"));


//post, put, delete - > CRUD
app.use("/api/boards", boardsRoutes);
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000;


//start-up server

app.listen(PORT, function(){
    console.log("Server is running on port" + PORT);
})

module.exports = app;