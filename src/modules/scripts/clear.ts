import {exists, unlink} from 'fs'

export const clearLocalFiles = (files: string[]) => {
    for (let i = 0; files.length > i; i++) {
        exists(files[i], (bool) => {
            if (bool) {
                unlink(files[i], () => {})
            }
        })
    }
}