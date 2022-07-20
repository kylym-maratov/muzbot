import express, { Express } from 'express'
import { Context, Telegraf } from "telegraf"
import { connectDb } from './modules/database/connect'
require('dotenv').config()


const port: number = Number(process.env.PORT) || 3000
const token: string = process.env.TOKEN || ''
const dbUrl: string = process.env.DB_URL || ''

const bot: Telegraf<Context> = new Telegraf(token)
const app: Express = express()

connectDb(dbUrl)
    .then(() => {
        app.listen(
            port,
            () => console.log(`Bot server running on port: ${port}`)
        )
    })
    .catch((e) => console.log(`Server running with error: ${(e as Error).message}`))

export default bot