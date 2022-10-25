require('dotenv').config()
const {Telegraf, Markup} = require('telegraf')

const TG_TOKEN = process.env.TELEGRAM_TOKEN

const bot = new Telegraf(TG_TOKEN)

bot.command('start',ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Menu:',//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: "Word map", callback_data: 'Wmap'}
                    ],
                    [
                        {text: "Me vocabulary",callback_data: 'Mvocabulary'}
                    ],
                    [
                        {text: "Info", callback_data: 'Info'}
                    ]
                ]
            }
        })
})

bot.action('Wmap', ctx =>{
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'Word map:',//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `1`, callback_data: `Wmap1`}
                    ],
                    [
                        {text: `2`, callback_data: `Wmap2`}
                    ],
                    [
                        {text: `3`, callback_data: `Wmap3`}
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

bot.action('Mvocabulary', ctx =>{
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'My vocabulary:',//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `1`, callback_data: `Mvocabulary1`}
                    ],
                    [
                        {text: `2`, callback_data: `Mvocabulary2`}
                    ],
                    [
                        {text: `3`, callback_data: `Mvocabulary3`}
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

bot.action('Menu', ctx=>{
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'Menu:',//TODO : thick font 'menu:'
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: "Word map", callback_data: 'Wmap'}
                    ],
                    [
                        {text: "Me vocabulary",callback_data: 'Mvocabulary'}
                    ],
                    [
                        {text: "Info", callback_data: 'Info'}
                    ]
                ]
            }
        })
})

bot.action('Info', ctx => {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'Info:\n...',//TODO : thick font 'menu:'
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

bot.launch().then(console.log("Launched!"))