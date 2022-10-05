import * as path from 'path'
import { getBasicInfo } from 'ytdl-core'
import { Context } from "telegraf"
import { Update } from "telegraf/typings/core/types/typegram"
import { convertWord, clearDownloadedFiles } from "../scirpts"
import { inlineKeyboard } from "../../../constants/static/inline-keyboard"
import { downloadAudioFile } from './helpers/download.video'
import { downloadThumbFile } from './helpers/download.thumb'
import { compilingAudioFile } from './helpers/compiling.audio'
import messages from '../../../constants/json/messages.json';
import urls from '../../../constants/json/urls.json';

const queue: string[] = []
const files = path.join(__dirname, '../../../files/')
const aviableVideoDuration: number = 12

//Main file download cycleMain download process
export default async function downloadAudioFromYoutube(ctx: Context<Update>, id: string) {

    try {
        if (queue.includes(id)) {
            return ctx.reply(messages.wait_download)
        }

        queue.push(id)

        const { videoDetails } = await getBasicInfo(urls.YOUTUBE + id)

        const videoDuration = Math.ceil(Number(videoDetails.lengthSeconds) / 60)

        if (videoDuration > aviableVideoDuration) {
            return ctx.reply(messages.long_video)
        }

        const audioFilePath: string = files + `${convertWord(videoDetails.title)}-${id}.mp3`

        const pictureFilePath: string = files + `${id}.jpg`

        const { message_id } = await ctx.reply(`id: ${id}\n\n${videoDetails.title}\n\n${messages.download_message}`)

        await Promise.all([downloadAudioFile(id, audioFilePath), downloadThumbFile(id, pictureFilePath)])
        const tags = await compilingAudioFile(videoDetails, audioFilePath, pictureFilePath)

        ctx.replyWithChatAction('upload_voice')
        await ctx.replyWithAudio({ source: audioFilePath }, {
            performer: tags.artist,
            title: tags.title,
            thumb: { source: tags.APIC },
            reply_markup: {
                inline_keyboard: inlineKeyboard.audio
            }
        })

        ctx.deleteMessage(message_id)

        clearDownloadedFiles([pictureFilePath, audioFilePath])

        queue.splice(queue.findIndex((item) => item === id), 1)

    } catch (e) {
        if (queue.includes(id)) {
            queue.splice(queue.findIndex((item) => item === id), 1)
        }

        ctx.reply((e as Error).message)
    }
}



