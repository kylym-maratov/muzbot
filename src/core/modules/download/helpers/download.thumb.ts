import * as fs from 'fs';
import urls from '../../../../constants/json/urls.json';
import * as http from 'https';

//Http download youtube video thumb
export const downloadThumbFile = (id: string, pictureFilePath: string) => {
    return new Promise((res, rej) => {
        const file = fs.createWriteStream(pictureFilePath)
        http.get(`${urls.YOUTUBE_PICTURE + id}/hqdefault.jpg`, response => {
            response.pipe(file)

            response.on('close', () => res(null))
            response.on('error', (e) => rej(e))
        })

    })
}