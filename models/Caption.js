const db = require('../ext/db')

const schema = new db.Schema({
    captionId: {
        type: Number,
        autoIncrement: true,
        unique: true
    },
    captionName: {
        type: String,
        required: true,
        default: 'Unnamed'
    },
    userId: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = db.model('Caption', schema)