import { Context, Telegraf } from "telegraf"
import { exists, mkdir } from 'fs'
import { join } from 'path'
import { connectDb } from "./modules/database/connect"
import 'dotenv/config'

const token: string = process.env.TOKEN || ''
const dbUrl: string = process.env.DB_URL || ''
const filesPatph: string = join(__dirname, '/files')

const bot: Telegraf<Context> = new Telegraf(token)

exists(filesPatph, (bool) => {
    if (!bool) {
        mkdir(filesPatph, (err) => {
            if (err) console.log(`Error create directory check server.ts file: ${err}`)
        })
    }
})

connectDb(dbUrl)
    .catch((e) => console.log(`Failed connect to database, error: ${e}`))


export default bot