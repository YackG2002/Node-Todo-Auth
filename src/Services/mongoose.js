require('dotenv').config()
const mongoose = require('mongoose')

const DbConnect = async function connectDb () {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Successfully connect to the Database !')
}

module.exports = DbConnect;