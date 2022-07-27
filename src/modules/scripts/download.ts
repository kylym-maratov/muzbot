import { createWriteStream } from "fs"
import { get } from "https"
import { join } from 'path'
import NodeID3 from 'node-id3'
import { getBasicInfo } from 'ytdl-core'
import stream from 'youtube-audio-stream'
import { Context } from "telegraf"
import { Update } from "telegraf/typings/core/types/typegram"
import { clearLocalFiles } from "./clear"
import { urls } from "../../constants/urls"
import { saveNewSong } from "../database/scripts/save"
import { SongTypes } from "../database/schemas/song/types"
import { Song } from "../database/schemas/song"
import { translateWord } from "./translate"

const downloading: string[] = []

interface TagsTypes {
    title: string;
    artist: string;
    album: string;
    APIC: string;
    TRCK: string;
}

const options = {
    include: ['TALB', 'TIT2'],
    exclude: ['APIC']
}

//Main download process
export const downloadAudioFromYoutube = async (ctx: Context<Update>, id: string, group: boolean = false) => {
    const username = `[${ctx.message?.from.first_name}](tg://user?id=${ctx.message?.from.id})`

    try {

        const song: SongTypes | null = await Song.findOne({ id })

        if (song) {
            return await ctx.replyWithAudio(song.data.file_id, {
                caption: group ? username : '',
                parse_mode: 'Markdown'
            })
        }

        if (downloading.includes(id)) {
            return ctx.reply('This song is already downloading ').then(({ message_id }) => {
                setTimeout(() => ctx.deleteMessage(message_id), 10000)
            })
        }

        downloading.push(id)

        const { videoDetails } = await getBasicInfo(urls.YOUTUBE + id)
        const audioFilePath: string = join(__dirname, `../../files/${translateWord(videoDetails.title)}-${id}.mp3`)
        const pictureFilePath: string = join(__dirname, `../../files/${id}.jpg`)
        const { message_id } = await ctx.reply(`id: ${id}\n\n${videoDetails.title}\n\nDownloading audio file from youtube please wait...`)
        await Promise.all([downloadAudio(id, audioFilePath), downloadPicture(id, pictureFilePath)])
        const tags = await compilingAudioFile(videoDetails, audioFilePath, pictureFilePath)

        ctx.replyWithChatAction('upload_voice')
        const { audio } = await ctx.replyWithAudio({ source: audioFilePath }, {
            performer: tags.artist,
            title: tags.title,
            thumb: { source: tags.APIC },
            caption: group ? username : '',
            parse_mode: 'Markdown'
        })

        await saveNewSong({
            id,
            data: audio,
            date: ''
        })

        ctx.deleteMessage(message_id)
        clearLocalFiles([pictureFilePath, audioFilePath])
        const index = downloading.findIndex((item) => item === id)
        downloading.splice(index, 1)

    } catch (e) {
        if (downloading.includes(id)) {
            const index = downloading.findIndex((item) => item === id)
            downloading.splice(index, 1)
        }

        ctx.reply((e as Error).message)
    }
}

//Download audio file from youtube, user youtube-dl in exec command
const downloadAudio = (id: string, audioFilePath: string) => {
    return new Promise((res, rej) => {
        stream(urls.YOUTUBE + id)
            .pipe(createWriteStream(audioFilePath))
            .on('finish', () => res(null))
            .on('error', (err) => rej(err))
    })
}

//Http download youtube video thumb
const downloadPicture = (id: string, pictureFilePath: string) => {
    return new Promise((res, rej) => {
        const file = createWriteStream(pictureFilePath)
        get(`${urls.YOUTUBE_PICTURE + id}/hqdefault.jpg`, response => {
            response.pipe(file)

            response.on('close', () => res(null))
            response.on('error', (e) => rej(e))
        })

    })
}

//Compiling video and picture, and edit audio tags
const compilingAudioFile = (videoDetails: any, audioFilePath: string, pictureFilePath: string): Promise<TagsTypes> => {
    return new Promise((res, rej) => {
        const arrTitle: string[] = videoDetails.title.split('-')

        const tags: TagsTypes = {
            title: arrTitle[1] ? arrTitle[1] : arrTitle[0],
            artist: arrTitle[1] ? arrTitle[0] : "Unknown artist",
            album: "Unknown album",
            APIC: pictureFilePath,
            TRCK: "27"
        }

        NodeID3.update(tags, audioFilePath, options)

        res(tags)
    })
}