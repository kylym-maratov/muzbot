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
const server_1 = __importDefault(require("./server"));
const messages_json_1 = __importDefault(require("./constants/json/messages.json"));
const save_1 = require("./modules/database/scripts/save");
const text_1 = require("./modules/scripts/text");
const download_1 = require("./modules/scripts/download");
const search_1 = require("./modules/scripts/search");
const song_1 = require("./modules/database/schemas/song");
const urls_1 = require("./constants/urls");
//Bot start handler
server_1.default.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, save_1.saveNewUser)({
            about: {
                id: ctx.message.from.id,
                first_name: ctx.message.from.first_name,
                last_name: ctx.message.from.last_name,
                username: ctx.message.from.username,
                is_bot: ctx.message.from.is_bot
            },
            data: { favorites: [] },
            register_date: ''
        });
    }
    catch (e) {
        ctx.reply(e.message);
    }
    finally {
        ctx.reply(messages_json_1.default.start);
    }
}));
//Bot message handler
server_1.default.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const text = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
    const id = (0, text_1.parseInputText)(text);
    const chatType = (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.chat.type;
    try {
        if (chatType === 'private') {
            if (text !== id) {
                (0, download_1.downloadAudioFromYoutube)(ctx, id);
            }
            if (text === id) {
                const videos = yield (0, search_1.searcYoutubeWithKeyboard)(text);
                if (!videos.length) {
                    return yield ctx.reply('I couldnt find anything :(');
                }
                yield ctx.reply('Here is what I found', {
                    reply_markup: {
                        inline_keyboard: videos
                    }
                });
            }
        }
        if (chatType === 'group' || chatType === 'supergroup') {
            if (text.includes('!') && text[0] === '!') {
                if (text === id) {
                    const videos = yield (0, search_1.searchYoutube)(text.replace('!', ''));
                    if (!videos.length) {
                        return yield ctx.reply('I couldnt find anything :(');
                    }
                    (0, download_1.downloadAudioFromYoutube)(ctx, videos[0].id, true);
                }
                if (text !== id) {
                    (0, download_1.downloadAudioFromYoutube)(ctx, id, true);
                }
            }
        }
    }
    catch (e) {
        ctx.reply(e.message);
    }
}));
//Bot callback hanlder
server_1.default.on('callback_query', (ctx) => {
    var _a;
    const cb = ctx.callbackQuery.data ? ctx.callbackQuery.data : '';
    const messageid = (_a = ctx.callbackQuery.message) === null || _a === void 0 ? void 0 : _a.message_id;
    if (cb.includes('download')) {
        (0, download_1.downloadAudioFromYoutube)(ctx, cb.split(' ')[0]);
    }
    switch (cb) {
        case 'delete':
            ctx.deleteMessage(messageid);
            break;
        default:
            return;
    }
});
//Bot inline hanlder
server_1.default.on('inline_query', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const audios = [];
        const articles = [];
        const videos = yield (0, search_1.searchYoutube)(ctx.inlineQuery.query);
        for (let i = 0; videos.length > i; i++) {
            const song = yield song_1.Song.findOne({ id: videos[i].id });
            if (song && song.data.title) {
                audios.push({
                    type: 'audio',
                    id: String(i + 1),
                    audio_file_id: song.data.file_id,
                    reply_markup: {
                        inline_keyboard: [[{
                                    text: 'Youtube',
                                    url: urls_1.urls.YOUTUBE + videos[i].id
                                }]]
                    }
                });
            }
            articles.push({
                type: 'article',
                id: String(i + 1),
                title: videos[i].original_title ? videos[i].original_title : 'Unkown track',
                thumb_url: `${urls_1.urls.YOUTUBE_PICTURE + videos[i].id}/hqdefault.jpg`,
                input_message_content: {
                    message_text: `!${urls_1.urls.YOUTUBE + videos[i].id}`
                },
                description: videos[i].duration ? `Duration: ${Math.ceil(videos[i].duration / 60)} minutes` : ''
            });
        }
        if (audios.length < 2) {
            return ctx.answerInlineQuery(articles);
        }
        ctx.answerInlineQuery(audios);
    }
    catch (e) {
        console.log(e);
        return;
    }
}));
server_1.default.launch({
    webhook: {
        domain: process.env.WEB_HOOK_DOMAIN,
        port: 8080
    }
});
