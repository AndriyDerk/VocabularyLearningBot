const db = require('../ext/db')

const schema = new db.Schema({
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    page:{
        type: Number,
        default: 0
    },
    lastCallBack:{
        type: String,
        default: "Menu"
    }
})

module.exports = db.model('User', schema)