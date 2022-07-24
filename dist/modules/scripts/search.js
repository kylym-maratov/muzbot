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
exports.searchYoutube = exports.searcYoutubeWithKeyboard = void 0;
const usetube_1 = require("usetube");
const keyboard_1 = require("../../constants/keyboard");
const aviableDuration = 10;
const aviableVideos = 8;
const searcYoutubeWithKeyboard = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    const { videos } = yield (0, usetube_1.searchVideo)(text);
    for (let i = 0; videos.length > i; i++) {
        const duration = Math.ceil(Number(videos[i].duration / 60));
        if (aviableVideos < i) {
            break;
        }
        if (aviableDuration < duration) {
            continue;
        }
        result.push(new Array({
            text: `${videos[i].original_title}`,
            callback_data: `${videos[i].id} download`
        }));
    }
    result.push(keyboard_1.keyboardConstatns.delete);
    return result;
});
exports.searcYoutubeWithKeyboard = searcYoutubeWithKeyboard;
const searchYoutube = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    const { videos } = yield (0, usetube_1.searchVideo)(text);
    for (let i = 0; videos.length > i; i++) {
        const duration = Math.ceil(Number(videos[i].duration / 60));
        if (aviableVideos < i) {
            break;
        }
        if (aviableDuration < duration) {
            continue;
        }
        result.push(videos[i]);
    }
    return result;
});
exports.searchYoutube = searchYoutube;
