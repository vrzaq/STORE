"use strict";
require('dotenv').config();

const { flatDirectly } = require('../importantly/flatDirectly.js');
const { configuration } = require('../arguments/configuration.js');
const { moment, axios, baileys, PhoneNumber, fs, chalk, path, child_process, yargs, util, jimp, FileType } = new flatDirectly();
const { default: makeWASocket, areJidsSameUser, jidNormalizedUser, DisconnectReason, AnyMessageContent, delay, generateForwardMessageContent, isJidGroup, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, fetchLatestBaileysVersion, jidDecode, getContentType, proto } = baileys;

exports.dataREKAP = {
    tebakgambar: JSON.parse(fs.readFileSync('./dbase/users/tebak/tebakgambar.json')),
    ban: JSON.parse(fs.readFileSync('./dbase/users/banned/ban.json')),
    antilinkgroup: JSON.parse(fs.readFileSync('./dbase/group/antilink/antilinkgroup.json')),
    welcome: JSON.parse(fs.readFileSync('./dbase/group/welcome/welcome.json'))
};