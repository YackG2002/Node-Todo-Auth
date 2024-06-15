const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
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
        validate(v){ 
            if(!validator.isLength(v, {min: 6, max: 200})) throw new Error('Password too short or long !')
        }
    }, 

    authTokens: [{
        authToken: {
            type: String,
            required: true
        }
    }]

})

//A simple little middleware to encrypt user password in any sign in or login
userSChema.pre('save', async function(){
    if(this.isModified('password')) this.password = await bcrypt.hash(this.password, 8)
})
//Method attached toinstance of userSchema that permit Token generation
userSChema.methods.generateAuthToken = async function(){
    const authToken = jwt.sign({_id: this._id.toString()}, 'foo')
    this.authTokens.push({authToken})
    await this.save();
    return authToken
}

//Method attached to the Model to find a correct User when authentification
userSChema.statics.findUser = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) throw new Error('E-mail or password invalid');
    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword) throw new Error('E-mail or password invalid');
    return user;
}

const User = mongoose.model('User', userSChema)

module.exports = User;