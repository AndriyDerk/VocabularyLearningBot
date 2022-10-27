require('dotenv').config()
const {Telegraf} = require('telegraf')
const User = require('./models/User')
const Caption = require('./models/Caption')

const TG_TOKEN = process.env.TELEGRAM_TOKEN

const bot = new Telegraf(TG_TOKEN)

bot.command('start',async ctx => {
    console.log(ctx.chat.id)
    const candidate = await User.findOne({chatId: ctx.chat.id})
    if(!candidate){
        const user = new User({
            chatId: ctx.chat.id
        })
        await user.save()
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Menu'})

    await bot.telegram.sendMessage(ctx.chat.id, 'Menu:',//TODO : thick font 'menu:'
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

bot.action('Wmap', async ctx =>{
    ctx.deleteMessage();
    await User.updateOne({chatId: ctx.chat.id}, {page: 0})
    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Wmap'})

    await bot.telegram.sendMessage(ctx.chat.id, `Word map, page ${user.page} :`,//TODO : thick font `menu:'
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

bot.action('Mvocabulary',  async ctx =>{
    ctx.deleteMessage();
    await User.updateOne({chatId: ctx.chat.id}, {page: 0})
    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Mvocabulary'})

    await bot.telegram.sendMessage(ctx.chat.id, `My vocabulary, page ${user.page/3+1} :`,//TODO : thick font 'menu:'
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

bot.action('Menu', async ctx=>{
    ctx.deleteMessage();

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Menu'})

    await bot.telegram.sendMessage(ctx.chat.id, 'Menu:',//TODO : thick font 'menu:'
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

bot.action('Info', async ctx => {
    ctx.deleteMessage();

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Info'})

    await bot.telegram.sendMessage(ctx.chat.id, 'Info:\n...',//TODO : thick font 'menu:'
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

bot.action('Wmap<', async ctx => {
    ctx.deleteMessage();

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }

        const page = Math.max(user.page-3, 0)
        await User.updateOne({chatId: ctx.chat.id}, {page})


    await bot.telegram.sendMessage(ctx.chat.id, `Word map, page ${page/3+1} :`,//TODO : thick font `menu:'
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

bot.action('Wmap>', async ctx => {
    ctx.deleteMessage();

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    const page = user.page+3
    await User.updateOne({chatId: ctx.chat.id}, {page})
    await bot.telegram.sendMessage(ctx.chat.id, `Word map, page ${page/3+1} :`,//TODO : thick font `menu:'
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

bot.action('Mvocabulary<', async ctx => {
    ctx.deleteMessage();

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }

    const page = Math.max(user.page-3, 0)
    await User.updateOne({chatId: ctx.chat.id}, {page})

    await bot.telegram.sendMessage(ctx.chat.id, `My vocabulary, page ${page/3+1} :`,//TODO : thick font 'menu:'
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

bot.action('Mvocabulary>', async ctx => {
    ctx.deleteMessage();

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    const page = user.page+3
    await User.updateOne({chatId: ctx.chat.id}, {page})

    await bot.telegram.sendMessage(ctx.chat.id, `My vocabulary, page ${page/3+1} :`,//TODO : thick font 'menu:'
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

bot.action('Mvocabularyadd', async ctx => {
    ctx.deleteMessage();

    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Mvocabularyadd'})
    await bot.telegram.sendMessage(ctx.chat.id, "Enter a caption name:")

})

bot.on('message', async ctx=>{// here is messages
    const user = await User.findOne({chatId: ctx.chat.id})
    if(!user){
        return console.log(`error`)
    }
    if(user.lastCallBack==='Mvocabularyadd'){
        const caption = new Caption({
            captionName: ctx.message.text,
            chatId: ctx.chat.id
        })
        await caption.save()
        await  User.updateOne({chatId: ctx.chat.id}, {lastCallBack: 'Mvocabulary'})

        await bot.telegram.sendMessage(ctx.chat.id, `My vocabulary, page ${user.page/3+1} :`,//TODO : thick font 'menu:'
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

    }

})

bot.launch().then(console.log("Launched!"))

async function currentCaption(number, chatId){
    const list =await Caption.find({chatId}).then(data=>{
        if(number>=data.length){return '-'}else{
            return data[number].captionName
        }
    })

    return list
}