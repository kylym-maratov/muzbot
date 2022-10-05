import bot from './server'
import 'dotenv/config'
import { middleware } from './middleware'
import { searcYoutubeWithKeyboard } from './core/modules/search'
import downloadAudioFromYoutube from './core/modules/download'
import messages from './constants/json/messages.json'

//Get port and domain from local variables
const port: number = Number(process.env.PORT) || 3000
const domain: string = process.env.WEB_HOOK_DOMAIN || ''

bot.use(middleware);

bot.start(ctx => ctx.reply(messages.start))

bot.help(ctx => ctx.reply(messages.help))

bot.on('message', async (ctx: any) => {
    const text: string = ctx.message.text

    try {
        if (ctx.message.sender_chat) {
            downloadAudioFromYoutube(ctx, text)
        } else {
            const content = await searcYoutubeWithKeyboard(text)
            await ctx.reply('I found this', { reply_markup: { inline_keyboard: content } })
        }
    } catch (e) {
        ctx.reply((e as Error).message)
    }
})

bot.on('callback_query', ctx => {
    switch (ctx.callbackQuery.data) {
        case 'delete':
            ctx.deleteMessage(ctx.callbackQuery.message?.message_id)
            break
        default:
            return
    }
});

bot.launch(domain ? { webhook: { port, domain } } : {})
    .then(() => console.log(`Bot started on port: ${port}`))
    .catch((e) => console.log(`Bot started with error: ${e}`));