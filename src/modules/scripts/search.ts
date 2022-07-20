import { searchVideo, Video } from "usetube"
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram"
import { keyboardConstatns } from "../../constants/keyboard"

const aviableDuration: number = 10
const aviableVideos: number = 8

export const searcYoutubeWithKeyboard = async (text: string): Promise<InlineKeyboardButton[][]> => {
    const result: InlineKeyboardButton[][] = []
    const { videos } = await searchVideo(text)

    for (let i = 0; videos.length > i; i++) {
        const duration: number = Math.ceil(Number(videos[i].duration / 60))

        if (aviableVideos < i) {
            break
        }
        if (aviableDuration < duration) {
            continue
        }

        result.push(new Array({
            text: `${videos[i].original_title}`,
            callback_data: `${videos[i].id} download`
        }))
    }

    result.push(keyboardConstatns.delete)

    return result
}

export const searchYoutube = async (text: string): Promise<Video[]> => {
    const result: Video[] = []
    const { videos } = await searchVideo(text)

    for (let i = 0; videos.length > i; i++) {
        const duration: number = Math.ceil(Number(videos[i].duration / 60))

        if (aviableVideos < i) {
            break
        }
        if (aviableDuration < duration) {
            continue
        }

        result.push(videos[i])
    }

    return result
}