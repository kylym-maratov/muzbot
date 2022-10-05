import stream from 'youtube-audio-stream'
import * as fs from 'fs';
import urls from '../../../../constants/json/urls.json';

//Download audio file from youtube, user youtube-dl in exec command
export const downloadAudioFile = (id: string, audioFilePath: string) => {
    return new Promise((res, rej) => {
        stream(urls.YOUTUBE + id)
            .pipe(fs.createWriteStream(audioFilePath))
            .on('finish', () => res(null))
            .on('error', (err) => rej(err))
    })
}