"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = void 0;
const mongoose_1 = require("mongoose");
exports.Song = (0, mongoose_1.model)('songs', new mongoose_1.Schema({
    id: String,
    data: Object,
    date: String
}));
