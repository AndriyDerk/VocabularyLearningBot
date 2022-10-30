const {Composer} = require('telegraf')
const composer = new Composer()
const User = require('../models/User')
const Caption = require('../models/Caption')
const Word = require('../models/Word')

composer.action('Mvocabulary',  async ctx =>{
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});
    await User.updateOne({chatId: ctx.chat.id}, {page: 0})
    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Mvocabulary'})

    await ctx.telegram.sendMessage(ctx.chat.id, `My vocabulary, page ${user.page/3+1} :`,//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `${await currentCaption(user.page, ctx.chat.id)}`, callback_data: `Mvocabulary1`}
                    ],
                    [
                        {text: `${await currentCaption(user.page+1, ctx.chat.id)}`, callback_data: `Mvocabulary2`}
                    ],
                    [
                        {text: `${await currentCaption(user.page+2, ctx.chat.id)}`, callback_data: `Mvocabulary3`}
                    ],
                    [
                        {text: `<`, callback_data: `Mvocabulary<`},
                        {text: `>`, callback_data: `Mvocabulary>`},
                    ],
                    [
                        {text: `Add caption`, callback_data: `Mvocabularyadd`}
                    ],
                    [
                        {text: `Menu`, callback_data: `Menu`}
                    ]
                ]
            }
        })
})

composer.action('Mvocabulary<', async ctx => {
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }

    const page = Math.max(user.page-3, 0)
    await User.updateOne({chatId: ctx.chat.id}, {page})

    await ctx.telegram.sendMessage(ctx.chat.id, `My vocabulary, page ${page/3+1} :`,//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `${await currentCaption(page, ctx.chat.id)}`, callback_data: `Mvocabulary1`}
                    ],
                    [
                        {text: `${await currentCaption(page+1, ctx.chat.id)}`, callback_data: `Mvocabulary2`}
                    ],
                    [
                        {text: `${await currentCaption(page+2, ctx.chat.id)}`, callback_data: `Mvocabulary3`}
                    ],
                    [
                        {text: `<`, callback_data: `Mvocabulary<`},
                        {text: `>`, callback_data: `Mvocabulary>`},
                    ],
                    [
                        {text: `Add caption`, callback_data: `Mvocabularyadd`}
                    ],
                    [
                        {text: `Menu`, callback_data: `Menu`}
                    ]
                ]
            }
        })

})

composer.action('Mvocabulary>', async ctx => {
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    const page = user.page+3
    await User.updateOne({chatId: ctx.chat.id}, {page})

    await ctx.telegram.sendMessage(ctx.chat.id, `My vocabulary, page ${page/3+1} :`,//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `${await currentCaption(page, ctx.chat.id)}`, callback_data: `Mvocabulary1`}
                    ],
                    [
                        {text: `${await currentCaption(page+1, ctx.chat.id)}`, callback_data: `Mvocabulary2`}
                    ],
                    [
                        {text: `${await currentCaption(page+2, ctx.chat.id)}`, callback_data: `Mvocabulary3`},
                    ],
                    [
                        {text: `<`, callback_data: `Mvocabulary<`},
                        {text: `>`, callback_data: `Mvocabulary>`},
                    ],
                    [
                        {text: `Add caption`, callback_data: `Mvocabularyadd`}
                    ],
                    [
                        {text: `Menu`, callback_data: `Menu`}
                    ]
                ]
            }
        })

})

composer.action('Mvocabularyadd', async ctx => {
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Mvocabularyadd'})
    await ctx.telegram.sendMessage(ctx.chat.id, "Enter a caption name:")

})

composer.action('Mvocabulary1', async ctx=> {// here is messages
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }

    await User.findOne({chatId: ctx.chat.id}, {enteredCaption: await currentCaption(user.page, ctx.chat.id)})

    await ctx.telegram.sendMessage(ctx.chat.id, `Caption name: ${await currentCaption(user.page, ctx.chat.id)}\nNumber of words: ${1}`, {
        reply_markup:{
            inline_keyboard:[
                [
                    {text: `Learn the words`, callback_data: 'Mvocabularylearn'}
                ],
                [
                    {text: `Add word`, callback_data: `Mvocabularyaddword`}
                ],
                [
                    {text: `Back`, callback_data: `Mvocabulary`}
                ]
            ]
        }
    })

})

composer.action('Mvocabularyaddword', async ctx=>{
    ctx.deleteMessage().catch(err => {console.log(`can't be deleted`)});

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }

    ctx.telegram.sendMessage(ctx.chat.id, 'Enter the word: ')

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
