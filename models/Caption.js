const db = require('../ext/db')

const schema = new db.Schema({
    captionName: {
        type: String,
        required: true,
        default: 'Unnamed'
    },
    chatId: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = db.model('Caption', schema)