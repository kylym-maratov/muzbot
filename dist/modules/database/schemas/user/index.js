"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
exports.User = (0, mongoose_1.model)('users', new mongoose_1.Schema({
    about: {
        id: Number,
        first_name: String,
        last_name: String,
        username: String,
        is_bot: Boolean
    },
    data: {
        favorites: Array
    },
    register_date: String
}, { versionKey: false }));
