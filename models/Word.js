const db = require('../ext/db')

const schema = new db.Schema({
    name: {
        type: String,
        required: true
    },
    translation:{
        type: String,
        required: true
    },
    captionName: {
        type: String,
        required: true,
    },
    chatId: {
        type: String,
        required: true,
    }
})

module.exports = db.model('Word', schema)