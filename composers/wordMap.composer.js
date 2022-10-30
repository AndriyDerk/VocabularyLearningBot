const {Composer} = require('telegraf')
const composer = new Composer()
const User = require('../models/User')
const Caption = require('../models/Caption')
const Word = require('../models/Word')

composer.action('Wmap', async ctx =>{
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});
    await User.updateOne({chatId: ctx.chat.id}, {page: 0})
    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Wmap'})

    await ctx.telegram.sendMessage(ctx.chat.id, `Word map, page ${user.page} :`,//TODO : thick font `menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `${1+user.page}`, callback_data: `Wmap1`}
                    ],
                    [
                        {text: `${2+user.page}`, callback_data: `Wmap2`}
                    ],
                    [
                        {text: `${3+user.page}`, callback_data: `Wmap3`}
                    ],
                    [
                        {text: `<`, callback_data: `Wmap<`},
                        {text: `>`, callback_data: `Wmap>`},
                    ],
                    [
                        {text: `Menu`, callback_data: `Menu`}
                    ]
                ]
            }
        })
})

composer.action('Wmap<', async ctx => {
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }

    const page = Math.max(user.page-3, 0)
    await User.updateOne({chatId: ctx.chat.id}, {page})


    await ctx.telegram.sendMessage(ctx.chat.id, `Word map, page ${page/3+1} :`,//TODO : thick font `menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `${1+page}`, callback_data: `Wmap1`}
                    ],
                    [
                        {text: `${2+page}`, callback_data: `Wmap2`}
                    ],
                    [
                        {text: `${3+page}`, callback_data: `Wmap3`}
                    ],
                    [
                        {text: `<`, callback_data: `Wmap<`},
                        {text: `>`, callback_data: `Wmap>`},
                    ],
                    [
                        {text: `Menu`, callback_data: `Menu`}
                    ]
                ]
            }
        })

})

composer.action('Wmap>', async ctx => {
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    const page = user.page+3
    await User.updateOne({chatId: ctx.chat.id}, {page})
    await ctx.telegram.sendMessage(ctx.chat.id, `Word map, page ${page/3+1} :`,//TODO : thick font `menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `${1+page}`, callback_data: `Wmap1`}
                    ],
                    [
                        {text: `${2+page}`, callback_data: `Wmap2`}
                    ],
                    [
                        {text: `${3+page}`, callback_data: `Wmap3`}
                    ],
                    [
                        {text: `<`, callback_data: `Wmap<`},
                        {text: `>`, callback_data: `Wmap>`},
                    ],
                    [
                        {text: `Menu`, callback_data: `Menu`}
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