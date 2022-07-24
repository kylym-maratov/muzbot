"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLocalFiles = void 0;
const fs_1 = require("fs");
const clearLocalFiles = (files) => {
    for (let i = 0; files.length > i; i++) {
        (0, fs_1.exists)(files[i], (bool) => {
            if (bool) {
                (0, fs_1.unlink)(files[i], () => { });
            }
        });
    }
};
exports.clearLocalFiles = clearLocalFiles;
