require('dotenv').config()
const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors =require('cors')
const app = express();

const Person = require('./models/person');

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(cors())
app.use(express.static('build'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


const generateID = () => {
    return Math.floor(Math.random() * 10000);
};


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
});


app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)

    Person.findById(id).then(person => {
        const foundPerson = person
    
        if (foundPerson) {
            res.json(person);
            }
        else {
            res.status(404).end();
            }
    });
});


app.get('/info', (req, res) => {
    date = new Date();
    Person.find({}).then(persons => {
        let count = persons.length;
 
        res.send(
            `<div>Phonebook has info for ${count} people</div>
            <div>${date}</div>`
        );
    });
});


app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    // persons = persons.filter(p => p.id !== id);
  
    // res.status(204).end();
  });


app.post('/api/persons', (req, res) => {
    const body = req.body
    //Check if name already exists in phonebook
    // let exists = false;

    // Object.keys(persons).forEach((person) => {
    //     if (persons[person].name === req.body.name) {
    //         exists = true;
    //     };
    // })

    //Check if request contains valid information
    
    if (!body.name) {
        return res.status(400).json({
            error: 'missing name'
        });
    }

    else if (!body.number) {
        return res.status(400).json({
            error: 'missing number'
        });
    }

    // else if (exists) {
    //     return res.status(409).json({
    //         error: 'name already exists'
    //     });
    // }
    
    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
    })

    person.save().then(savedPerson => {
        res.json(savedPerson);
    });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

