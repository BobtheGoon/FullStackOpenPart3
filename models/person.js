const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);
mongoose.connect(url)
    .then( () => {
        console.log('Connected to database');
    })
    .catch(error => {
        console.log('Error connecting to database: ', error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    number: {
        type: String,
        minlength:10,
        required: true
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);