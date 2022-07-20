import { model, Schema } from "mongoose"
import { UserTypes } from './types'


export const User = model('users', new Schema<UserTypes>({
    about: {
        id: Number,
        first_name: String,
        last_name: String,
        username: String,
        is_bot: Boolean
    },
    data: {
        favorites: Array
    },
    register_date: String
}, { versionKey: false }))