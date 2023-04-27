const router = require("express").Router();
const boards = require("../models/boards");
const { response } = require("../server");
const { verifyToken } = require("../validation");


// CRUD operations

// api/boards/
// Create boards (post)
router.post("/", verifyToken, (req, res) => {

    data = req.body;

    boards.insertMany( data )
    .then(data => { res.status(201).send(data);})
    .catch(err => { res.status(500).send ( { message: err.message }); })

});

// api/boards/
// Read all boards (get)
router.get("/", (req, res) => { 

    boards.find()
    .then(data => { res.send(mapArray(data)) })
    .catch(err => { res.status(500).send( { message: err.message } )})
});

// Read all boards in stock (get)
router.get("/instock", (req, res) => { 

    boards.find({ inStock: true})
    .then(data => { res.send(mapArray(data)) })
    .catch (err => { res.status(500).send( { message: err.message } )})
});


router.get("/random", (req, res) => {
    //get a random board
    boards.countDocuments({})
    .then (count => {

        // Get a random number
        let random = Math.floor(Math.random() * count);

        // Query all document, but fetch only one with the ofset of "random"
        boards.findOne().skip(random)
        .then (data => { res.status(200).send(mapData(data))})
        .catch(err => {
            res.status(500).send({ message: err.message });
        })

    })
});

/*
"search function"
//Read all documents based on variable field and value
router.get("/:field/:value", (request, response) => {   
    
    const field = request.params.field;
    const value = request.params.value;
    
    board.find({ [field]: { $regex: request.params.value, $options:'i' } })
    .then (data => { response.send(data) })  
    .catch (err => { 
        response.status(500).send( { message: err.message } )
    })
});
*/


//Read specific boards based on id (get)
router.get("/:id", (req, res) => {   
    boards.findById(req.params.id)
    .then(data => { res.send(mapData(data)) })
    .catch (err => { res.status(500).send( { message: err.message } ) })
});

// Read all boards in stock (get)
router.get("/instock", (req, res) => { 

    boards.find({ inStock: true})
    .then(data => { res.send(mapArray(data)) })
    .catch (err => { res.status(500).send( { message: err.message } )})
});

// Read all type of boards (get)
router.get("/type", (req, res) => { 

    boards.find(req.params.type)
    .then(data => { res.send(mapArray(data)) })
    .catch (err => { res.status(500).send( { message: err.message } )})
});


// Update specific boards (put)
router.put("/:id", (req, res) => { 
    const id = req.params.id;

    boards.findByIdAndUpdate( id, req.body)
    .then(data => {
        if(!data)
        {
            res.status(404).send({message: "Cannot update board with id=" + id + ". Maybe the board was not found!"});
        }
        else
        {
            res.send({ message: "Board was successfully updated."});
        }
    })
    .catch (err => { res.status(500).send( { message: "Error updating board with id=" + id } )
})
});

// Delete specific board (delete)
router.delete("/:id", (req, res) => {   
    
    const id = req.params.id;
    boards.findByIdAndDelete(id)
    .then(data => { 
        if (!data) {
            res.status(404).send({message: "Cannot delete board with id=" + id + ". Maybe the board was not found!"});
        }
        else {
            res.send({ message: "Board was successfully deleted."});
        }
    })
    .catch (err => { res.status(500).send( { message: "Error deleting board with id=" + id } )
})
});

function mapArray(inputArray) {

    // do something with inputArray
    let outputArray = inputArray.map(element => (mapData(element)));

    return outputArray;
}

function mapData(element) 
{
    let outputObj = 
    {
        id: element._id,
        name: element.name,
        type: element.type,
        style: element.style,
        description: element.description,
        price: element.price,
        inStock: element.inStock,

        // add uri (HATEOAS) for this specific resource
        uri: "/api/boards/" + element._id
    }

    return outputObj;
} 





module.exports = router;


