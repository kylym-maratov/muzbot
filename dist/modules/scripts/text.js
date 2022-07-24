"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInputText = void 0;
const urls_1 = require("../../constants/urls");
const parseInputText = (text) => {
    if (text.includes(urls_1.urls.YOUTUBE)) {
        return text.split('=')[1].split('&')[0];
    }
    if (text.includes(urls_1.urls.YOUTUTBE_MOBILE)) {
        return text.split('/')[3].split('?')[0];
    }
    return text;
};
exports.parseInputText = parseInputText;
