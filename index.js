require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors =require('cors');
const app = express();

const Person = require('./models/person');

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});


app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    Person.findById(id).then(person => {
        if (person) {
            res.json(person);
        }
        else {
            res.status(404).end();
        }
    })
        .catch(error => next(error));
});


app.get('/info', (req, res) => {
    const date = new Date();
    Person.find({}).then(persons => {
        let count = persons.length;

        res.send(
            `<div>Phonebook has info for ${count} people</div>
            <div>${date}</div>`
        );
    });
});


app.post('/api/persons', (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({
            error: 'missing name'
        });
    }

    if (!req.body.number) {
        return res.status(400).json({
            error: 'missing number'
        });
    }

    const person = new Person({
        name: req.body.name,
        number: req.body.number,
        date: new Date(),
    });

    person.save().then(savedPerson => {
        res.json(savedPerson);
    })
        .catch(error => next(error));
});


app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndRemove(id)
        .then( () => {
            res.status(204).end();
        })
        .catch(error => next(error));
});


app.put('/api/persons/:id', (req, res, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number,
    };

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(error => next(error));
});


//Handle cast errors
const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    console.log(error.name);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }

    else if (error.name === 'TypeError') {
        return res.status(400).send({ error: 'person already removed' });
    }

    else if (error.name === 'Validation error') {
        return res.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});