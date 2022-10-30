const {Composer} = require('telegraf')
const composer = new Composer()
const User = require('../models/User')
const Caption = require('../models/Caption')
const Word = require('../models/Word')

composer.command('start',async ctx => {
    console.log(ctx.chat.id)
    const candidate = await User.findOne({chatId: ctx.chat.id})
    if(!candidate){
        const user = new User({
            chatId: ctx.chat.id
        })
        await user.save()
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Menu'})

    await ctx.telegram.sendMessage(ctx.chat.id, 'Menu:',//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: "Word map", callback_data: 'Wmap'}
                    ],
                    [
                        {text: "My vocabulary",callback_data: 'Mvocabulary'}
                    ],
                    [
                        {text: "Info", callback_data: 'Info'}
                    ]
                ]
            }
        })
})


composer.action('Menu', async ctx=>{
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Menu'})

    await ctx.telegram.sendMessage(ctx.chat.id, 'Menu:',//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: "Word map", callback_data: 'Wmap'}
                    ],
                    [
                        {text: "My vocabulary",callback_data: 'Mvocabulary'}
                    ],
                    [
                        {text: "Info", callback_data: 'Info'}
                    ]
                ]
            }
        })
})

composer.action('Info', async ctx => {
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Info'})

    await ctx.telegram.sendMessage(ctx.chat.id, 'Info:\n...',//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: "Menu", callback_data: 'Menu'}
                    ]
                ]
            }
        })
})

async function currentCaption(number, chatId){
    const list =await Caption.find({chatId}).then(data=>{
        if(number>=data.length){return '-'}else{
            return data[number].captionName
        }
    })

    return list
}

module.exports = composer