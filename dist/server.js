"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const telegraf_1 = require("telegraf");
const connect_1 = require("./modules/database/connect");
require('dotenv').config();
const port = Number(process.env.PORT) || 3000;
const token = process.env.TOKEN || '';
const dbUrl = process.env.DB_URL || '';
const bot = new telegraf_1.Telegraf(token);
const app = (0, express_1.default)();
(0, connect_1.connectDb)(dbUrl)
    .then(() => {
    app.listen(port, () => console.log(`Bot server running on port: ${port}`));
})
    .catch((e) => console.log(`Server running with error: ${e.message}`));
exports.default = bot;
