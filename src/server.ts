import { Context, Telegraf } from "telegraf"
import * as path from 'path';
import * as fs  from 'fs';
import 'dotenv/config'

//Get bot token from local varibales
const token: string = process.env.TOKEN || ''
const pathDirectory: string = path.join(__dirname, '/files')
const bot: Telegraf<Context> = new Telegraf(token)

//Create directory where saving all songs before send to client
fs.exists(pathDirectory, (bool) => {
    if (!bool) {
        fs.mkdir(pathDirectory, (err) => {
            if (err) console.log(`Error create directory check server.ts file: ${err}`)
        })
    }
})

export default bot