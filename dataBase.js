const mongoose = require('mongoose');

// Connection string to connect with required data base
const mongoURI = "mongodb://localhost:27017/cloudNotebook?readPreference=primary&ssl=false&directConnection=true"

const connectToDatabase = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Database Successfully");
    })
}


module.exports = connectToDatabase;