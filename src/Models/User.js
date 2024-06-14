const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSChema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(v) {
            if(!validator.isEmail(v)) throw new Error('E-mail invalid !')
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        validate(v){ 
            if(!validator.isLength(v, {min: 6, max: 50})) throw new Error('Password too short or long !')
        }
    }, 

    authTokens: [{
        authToken: {
            type: String,
            required: true}
    }]

})
//Method attached toinstance of userSchema that permit Token generation
userSChema.methods.generateAuthToken = async function(){
    const authToken = jwt.sign({_id: this._id.toString()}, 'foo')
    this.authTokens.push(authToken)
    await this.save();
    return authToken

}
const User = mongoose.model('User', userSChema)

module.exports = User;