const mongoose = require('mongoose');


if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://BobtheGoon:${password}@fullstackopen.ltlfw6r.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

//Get numbers from database
if (process.argv.length < 4) {
   Person.find({}).then(result => {
    console.log('phonebook:')
       result.forEach(person => {
           console.log(`${person.name} ${person.number}`);
       });
    mongoose.connection.close();
    });
};

//Add number to database
if (process.argv.length > 3) {
    const person = new Person ({
        name: process.argv[3],
        number: process.argv[4]
    });
    
    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`);
        mongoose.connection.close();
    });
};
