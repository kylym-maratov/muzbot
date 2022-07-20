import { Song } from "../schemas/song"
import { SongTypes } from "../schemas/song/types"
import { User } from "../schemas/user"
import { UserTypes } from "../schemas/user/types"

export const saveNewUser = async (user: UserTypes) => {
    let date = new Date().toDateString()
    const candidate: UserTypes | null = await User.findOne({ 'about.id': user.about.id })

    if (candidate) {
        return
    }

    const newUser = new User({
        about: user.about,
        data: user.data,
        register_date: date
    })

    await newUser.save()
}

export const saveNewSong = async (song: SongTypes) => {
    let date = new Date().toDateString()

    const candidate: SongTypes | null = await Song.findOne({ id: song.id })

    if (candidate) {
        return
    }

    const newSong = new Song({
        id: song.id,
        data: song.data,
        date
    })

    await newSong.save()
}