import { searchVideo } from 'usetube'
import bot from './server'
import { saveNewUser } from "./modules/database/scripts/save"
import { parseInputText } from "./modules/scripts/text"
import { downloadAudioFromYoutube } from './modules/scripts/download'
import messages from './constants/json/messages.json'
import { searcYoutubeWithKeyboard, searchYoutube } from "./modules/scripts/search";
import { Song } from './modules/database/schemas/song'
import { InlineQueryResultCachedAudio, InlineQueryResultArticle } from 'typegram'
import { SongTypes } from './modules/database/schemas/song/types'
import { urls } from './constants/urls'

//Bot start handler
bot.start(async (ctx) => {
    try {
        await saveNewUser({
            about: {
                id: ctx.message.from.id,
                first_name: ctx.message.from.first_name,
                last_name: ctx.message.from.last_name,
                username: ctx.message.from.username,
                is_bot: ctx.message.from.is_bot
            },
            data: { favorites: [] },
            register_date: ''
        })
    } catch (e) {
        ctx.reply((e as Error).message)
    }
    finally {
        ctx.reply(messages.start)
    }
})

//Bot message handler
bot.on('text', async (ctx) => {
    const text: string | undefined = ctx.message?.text
    const id: string = parseInputText(text)
    const chatType: string | undefined = ctx.message?.chat.type

    try {

        if (chatType === 'private') {
            if (text !== id) {
                downloadAudioFromYoutube(ctx, id)
            }

            if (text === id) {
                const videos = await searcYoutubeWithKeyboard(text)

                if (!videos.length) {
                    return await ctx.reply('I couldnt find anything :(')
                }
                await ctx.reply('Here is what I found', {
                    reply_markup: {
                        inline_keyboard: videos
                    }
                })
            }
        }

        if (chatType === 'group' || chatType === 'supergroup') {
            if (text.includes('!') && text[0] === '!') {
                if (text === id) {
                    const videos = await searchYoutube(text.replace('!', ''))

                    if (!videos.length) {
                        return await ctx.reply('I couldnt find anything :(')
                    }

                    downloadAudioFromYoutube(ctx, videos[0].id, true)
                }

                if (text !== id) {
                    downloadAudioFromYoutube(ctx, id, true)
                }
            }
        }

    } catch (e) {
        ctx.reply((e as Error).message)
    }
})

//Bot callback hanlder
bot.on('callback_query', (ctx) => {
    const cb: string = ctx.callbackQuery.data ? ctx.callbackQuery.data : ''
    const messageid: number | undefined = ctx.callbackQuery.message?.message_id

    if (cb.includes('download')) {
        downloadAudioFromYoutube(ctx, cb.split(' ')[0])
    }

    switch (cb) {
        case 'delete':
            ctx.deleteMessage(messageid)
            break
        default:
            return
    }
})

//Bot inline hanlder
bot.on('inline_query', async (ctx) => {
    try {
        const audios: InlineQueryResultCachedAudio[] = []
        const articles: InlineQueryResultArticle[] = []
        const videos = await searchYoutube(ctx.inlineQuery.query)

        for (let i = 0; videos.length > i; i++) {
            const song: SongTypes | null = await Song.findOne({ id: videos[i].id })

            if (song && song.data.title) {
                audios.push({
                    type: 'audio',
                    id: String(i + 1),
                    audio_file_id: song.data.file_id,
                    reply_markup: {
                        inline_keyboard: [[{
                            text: 'Youtube',
                            url: urls.YOUTUBE + videos[i].id
                        }]]
                    }
                })
            }

            articles.push({
                type: 'article',
                id: String(i + 1),
                title: videos[i].original_title ? videos[i].original_title : 'Unkown track',
                thumb_url: `${urls.YOUTUBE_PICTURE + videos[i].id}/hqdefault.jpg`,
                input_message_content: {
                    message_text: `!${urls.YOUTUBE + videos[i].id}`
                },
                description: videos[i].duration ? `Duration: ${Math.ceil(videos[i].duration / 60)} minutes` : ''
            })
        }

        if (audios.length < 2) {
            return ctx.answerInlineQuery(articles)
        }

        ctx.answerInlineQuery(audios)
    } catch (e) {
        console.log(e)
        return
    }
})

bot.launch()