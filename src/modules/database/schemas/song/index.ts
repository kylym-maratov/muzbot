import { model, Schema } from "mongoose";
import { SongTypes } from "./types";


export const Song = model('songs', new Schema<SongTypes>({
    id: String,
    data: Object,
    date: String
}))