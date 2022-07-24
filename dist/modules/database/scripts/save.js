"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveNewSong = exports.saveNewUser = void 0;
const song_1 = require("../schemas/song");
const user_1 = require("../schemas/user");
const saveNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date().toDateString();
    const candidate = yield user_1.User.findOne({ 'about.id': user.about.id });
    if (candidate) {
        return;
    }
    const newUser = new user_1.User({
        about: user.about,
        data: user.data,
        register_date: date
    });
    yield newUser.save();
});
exports.saveNewUser = saveNewUser;
const saveNewSong = (song) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date().toDateString();
    const candidate = yield song_1.Song.findOne({ id: song.id });
    if (candidate) {
        return;
    }
    const newSong = new song_1.Song({
        id: song.id,
        data: song.data,
        date
    });
    yield newSong.save();
});
exports.saveNewSong = saveNewSong;
