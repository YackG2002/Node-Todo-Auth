const mongoose = require ('mongoose')
const todo = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Todo name is required']
    },

    startLine: {
        type: Date,
        required: [true, 'Start Date is required']
    },

    deadLine: {
        type: Date,
        required: [true, 'Deadline is required'],
        validate(v) {
            if(v < this.startLine) throw new Error('Deadline should posterior to startLine')
        }
    },

    done: {
        type: Boolean,
        required: true,
        default: false
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Todo = mongoose.model('Todo', todo)

module.exports = Todo;