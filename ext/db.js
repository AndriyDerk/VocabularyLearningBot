const db = require('mongoose')

const uri = process.env.DB_TOKEN

async function connect(){
    try{
        await db.connect(uri)
        console.log("Connected to MongeDB")
    }catch (error){
        console.log(`error`)
    }
}

connect();

module.exports = db;