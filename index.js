require('dotenv').config()
const {Telegraf} = require('telegraf')
const User = require('./models/User')
const Caption = require('./models/Caption')
const Word = require('./models/Word')

const TG_TOKEN = process.env.TELEGRAM_TOKEN

const bot = new Telegraf(TG_TOKEN)

bot.use(require('./composers/myVocabulary.composer'));
bot.use(require('./composers/menu.comser'));
bot.use(require('./composers/wordMap.composer'));

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

    }else
        if(user.lastCallBack === 'Mvocabularyaddword'){
            if(user.lastWord === ''){
                const word = await Word.findOne({name: ctx.message.text})
                if(word){
                    return bot.telegram.sendMessage(ctx.chat.id, 'word already exist')
                }
                await User.updateOne({chatId: ctx.chat.id}, {lastWord: ctx.message.text})
                bot.telegram.sendMessage(ctx.chat.id, 'Enter the translation: ')
            }else{
                const word = new Word({
                    name: user.lastWord,
                    translation: ctx.message.text,
                    enteredCaption: user.enteredCaption,
                    chatId: ctx.chat.id
                })
                word.save();
                await User.updateOne({chatId: ctx.chat.id}, {lastWord: ''})
            }
        }

})

bot.launch().then(console.log("Launched!"))