const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const reportSchema = new Schema({
    reportedBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    reportedPost: { type: mongoose.Types.ObjectId, required: true, ref: 'Post' },
    concern: { type: String, required: true },
    reportedUser: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
})

module.exports = mongoose.model('Report', reportSchema)