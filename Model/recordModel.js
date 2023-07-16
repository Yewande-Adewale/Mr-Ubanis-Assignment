const mongoose = require('mongoose')

const recordSchema = mongoose.Schema({
    math: {
            type: Number,
            required: true
},
    english: {
            type: Number,
            required: true
},


}, {timestamps: true})

const recordModel = mongoose.model("user", recordSchema)
 
module.exports = recordModel