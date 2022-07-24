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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAudioFromYoutube = void 0;
const fs_1 = require("fs");
const https_1 = require("https");
const node_id3_1 = __importDefault(require("node-id3"));
const ytdl_core_1 = require("ytdl-core");
const clear_1 = require("./clear");
const urls_1 = require("../../constants/urls");
const save_1 = require("../database/scripts/save");
const song_1 = require("../database/schemas/song");
const youtube_audio_stream_1 = __importDefault(require("youtube-audio-stream"));
const translate_1 = require("./translate");
const downloading = [];
const options = {
    include: ['TALB', 'TIT2'],
    exclude: ['APIC']
};
//Main download process
const downloadAudioFromYoutube = (ctx, id, group = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const username = `[${(_a = ctx.message) === null || _a === void 0 ? void 0 : _a.from.first_name}](tg://user?id=${(_b = ctx.message) === null || _b === void 0 ? void 0 : _b.from.id})`;
    try {
        const song = yield song_1.Song.findOne({ id });
        if (song) {
            return yield ctx.replyWithAudio(song.data.file_id, {
                caption: group ? username : '',
                parse_mode: 'Markdown'
            });
        }
        if (downloading.includes(id)) {
            return ctx.reply('This song is already downloading ').then(({ message_id }) => {
                setTimeout(() => ctx.deleteMessage(message_id), 10000);
            });
        }
        downloading.push(id);
        const { videoDetails } = yield (0, ytdl_core_1.getBasicInfo)(urls_1.urls.YOUTUBE + id);
        const filepath = `${(0, translate_1.translateWord)(videoDetails.title)}-${id}.mp3`;
        const { message_id } = yield ctx.reply(`id: ${id}\n\n${videoDetails.title}\n\nDownloading audio file from youtube please wait...`);
        yield Promise.all([downloadAudio(id, filepath), downloadPicture(id)]);
        const { tags } = yield compilingAudioFile(id, videoDetails, filepath);
        ctx.replyWithChatAction('upload_voice');
        const { audio } = yield ctx.replyWithAudio({ source: filepath }, {
            performer: tags.artist,
            title: tags.title,
            thumb: { source: tags.APIC },
            caption: group ? username : '',
            parse_mode: 'Markdown'
        });
        yield (0, save_1.saveNewSong)({
            id,
            data: audio,
            date: ''
        });
        ctx.deleteMessage(message_id);
        (0, clear_1.clearLocalFiles)([filepath, `${id}.jpg`]);
        const index = downloading.findIndex((item) => item === id);
        downloading.splice(index, 1);
    }
    catch (e) {
        if (downloading.includes(id)) {
            const index = downloading.findIndex((item) => item === id);
            downloading.splice(index, 1);
        }
        ctx.reply(e.message);
    }
});
exports.downloadAudioFromYoutube = downloadAudioFromYoutube;
//Download audio file from youtube, user youtube-dl in exec command
const downloadAudio = (id, filepath) => {
    return new Promise((res, rej) => {
        (0, youtube_audio_stream_1.default)(urls_1.urls.YOUTUBE + id)
            .pipe((0, fs_1.createWriteStream)(filepath))
            .on('finish', () => res(null))
            .on('error', (err) => rej(err));
    });
};
//Http download youtube video thumb
const downloadPicture = (id) => {
    return new Promise((res, rej) => {
        const file = (0, fs_1.createWriteStream)(`${id}.jpg`);
        (0, https_1.get)(`${urls_1.urls.YOUTUBE_PICTURE + id}/hqdefault.jpg`, response => {
            response.pipe(file);
            response.on('close', () => res(null));
            response.on('error', (e) => rej(e));
        });
    });
};
//Compiling video and picture, and edit audio tags
const compilingAudioFile = (id, videoDetails, filepath) => {
    return new Promise((res, rej) => {
        const arrTitle = videoDetails.title.split('-');
        const tags = {
            title: arrTitle[1] ? arrTitle[1] : arrTitle[0],
            artist: arrTitle[1] ? arrTitle[0] : "Unknown artist",
            album: "Unknown album",
            APIC: `${id}.jpg`,
            TRCK: "27"
        };
        node_id3_1.default.update(tags, filepath, options);
        res({
            tags
        });
    });
};
