const mongoose = require('mongoose');

console.log(process.argv.length);

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


if (process.argv.length < 4) {
   Person.find({}).then(result => {
       result.forEach(person => {
           console.log(person);
       });
    mongoose.connection.close();
    });
};


if (process.argv.length > 3) {
    const person = new Person ({
        name: process.argv[3],
        number: process.argv[4]
    });
    console.log(person);
    person.save().then(result => {
        console.log(`${result.name} saved to database!`);
        mongoose.connection.close();
    });
};
