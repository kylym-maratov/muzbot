import { User } from "../schemas/user"



export const deleteUser = async (id: number) => {
    try { await User.deleteOne({ 'about.id': id }) } catch (e) { throw e }
}