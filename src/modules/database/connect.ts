import mongoose from 'mongoose'

export const connectDb = async (dbUrl: string) => {
    try {
        await mongoose.connect(dbUrl)
    } catch (e) {
        throw e
    }
}