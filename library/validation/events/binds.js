"use strict";
require('dotenv').config();

const { flatDirectly } = require('../importantly/flatDirectly.js');
const { configuration } = require('../arguments/configuration.js');
const { dataREKAP } = require('../parse/jsonFile.js');
const { imageToWebp, writeExifImg, writeExifVid } = require('../tools/exif.js');
const { yta } = require('../scrape/y2mate.js');
const { node_fetch, hxz, yts, moment, axios, baileys, PhoneNumber, fs, chalk, path, child_process, yargs, util, jimp, FileType } = new flatDirectly();
const { default: makeWASocket, areJidsSameUser, jidNormalizedUser, DisconnectReason, AnyMessageContent, delay, generateForwardMessageContent, isJidGroup, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, fetchLatestBaileysVersion, jidDecode, getContentType, proto } = baileys;

exports.moduleWA = async(razzaq, m, store) => {
    razzaq.decodeJid = (jid) => {
        if(!jid) return jid
        if(/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    };
    razzaq.copyNForward = async(jid, message, forceForward = false, options = {}) => {
        let vtype
        if(options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
            vtype = Object.keys(message.message.viewOnceMessage.message)[0]
            delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
            delete message.message.viewOnceMessage.message[vtype].viewOnce
            message.message = {
            	...message.message.viewOnceMessage.message
            };
        };
        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
        let context = {}
        if(mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        };
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
	                ...content[ctype].contextInfo,
	                ...options.contextInfo
                }
            } : {})
        } : {})
        await razzaq.relayMessage(jid, waMessage.message, {
            messageId: waMessage.key.id
        });
        return waMessage
    };
    razzaq.downloadMediaMessage = async(message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        };
        return buffer
    };
    razzaq.saveName = async(id, name = '') => {
        if(!id) return
        id = razzaq.decodeJid(id)
        let isGroup = id.endsWith('@g.us')
        if(id in razzaq.contacts && razzaq.contacts[id][isGroup ? 'subject' : 'name'] && id in razzaq.chats) return
        let metadata = {}
        if(isGroup) metadata = await razzaq.groupMetadata(id)
        let chat = { ...(razzaq.contacts[id] || {}), id, ...(isGroup ? { subject: metadata.subject, desc: metadata.desc } : { name }) }
        razzaq.contacts[id] = chat
        razzaq.chats[id] = chat
    };
    razzaq.pushMessage = (m) => {
        if(['senderKeyDistributionMessage', 'protocolMessage'].includes(m.mtype)) return
        let id = m.chat
        let chats = razzaq.chats[id]
        if(!chats) chats = { id }
        if(!chats.messages) chats.messages = {}
        chats.messages[m.id] = JSON.stringify(m, null, 2)
    };
    razzaq.getName = async(jid = '', withoutContact = false) => {
        jid = razzaq.decodeJid(jid)
        withoutContact = razzaq.withoutContact || withoutContact
        let v
        if(jid.endsWith('@g.us')) return new Promise(async(resolve) => {
            v = razzaq.chats[jid] || {}
            if(!(v.name || v.subject)) v = await razzaq.groupMetadata(jid) || {} 
            resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = jid === '0@s.whatsapp.net' ? { jid, vname: 'WhatsApp' } : await areJidsSameUser(jid, razzaq.user.id) ? razzaq.user : (razzaq.chats[jid] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    };
    razzaq.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    };
    razzaq.getFile = async(PATH, returnAsFilename) => {
        let res, filename
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await node_fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        if(!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        if(data && returnAsFilename && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return {
            res,
            filename,
            ...type,
            data
        }
    };
    razzaq.sendFile = async(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await razzaq.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if(res && res.status !== 200 || file.length <= 65536) {
            try { 
                throw { 
                    json: JSON.parse(file.toString()) 
                } 
            } catch (err) { 
                if(err.json) 
                throw err.json 
            }
        }
        let opt = { filename }
        if(quoted) opt.quoted = quoted
        if(!type) 
        if(options.asDocument) options.asDocument = true
        let mtype = '', mimetype = type.mime
        if(/webp/.test(type.mime)) mtype = 'sticker'
        else if(/image/.test(type.mime)) mtype = 'image'
        else if(/video/.test(type.mime)) mtype = 'video'
        else if(/audio/.test(type.mime)) (convert = await (ptt ? toPTT : toAudio)(file, type.ext), file = convert.data, pathFile = convert.filename, mtype = 'audio', mimetype = 'audio/ogg; codecs=opus')
        else mtype = 'document'
        return await razzaq.sendMessage(jid, { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype }, { ...opt, ...options })
    };
    razzaq.reply = async(jid, text = '', quoted, options) => {
        return Buffer.isBuffer(text) ? razzaq.sendFile(jid, text, '', '', quoted, false, options) : razzaq.sendMessage(jid, { ...options, text }, { quoted, ...options })
    };
    razzaq.fakeReply = async(jid, text = '', fakeJid = razzaq.user.jid, fakeText = '', fakeGroupJid, options) => {
        return await razzaq.sendMessage(jid, { text: text }, { quoted: { key: { fromMe: fakeJid == razzaq.user.jid, participant: fakeJid, ...(fakeGroupJid ? { remoteJid: fakeGroupJid } : {}) }, message: { conversation: fakeText }, ...options } })
    };
    razzaq.replyWithMentions = async(jid, text = '', options = {}) => {
        return await razzaq.sendMessage(jid, { text: text, mentions: [razzaq.parseMention(text)] }, options)
    };
    razzaq.imageWithMentions = async(jid, path, caption = '', mentioned, quoted = '') => {
        return await razzaq.sendMessage(jid, { image: await getBuffer(path), caption: caption, mentions: mentioned }, { quoted: quoted })
    };
    razzaq.videoWithMentions = async(jid, path, caption = '', mentioned, quoted = '') => {
        return await razzaq.sendMessage(jid, { video: await getBuffer(path), caption: caption, mentions: mentioned, mimetype: 'video/mp4' }, { quoted: quoted })
    };
    razzaq.sendImage = async(jid, path, caption = '', quoted = '', options) => {
	    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
	    return await razzaq.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    };
    razzaq.sendButtonText = async (jid, buttons = [], text, footer, quoted, options = {}) => {
        let buttonMessage = {
            text: text,
            footer: footer,
            buttons: buttons,
            headerType: 2,
            ...options
        };
        return await razzaq.sendMessage(jid, buttonMessage, { quoted: quoted, options })
    };
    razzaq.sendL = async (jid, latitude, longitude, name, address, url, location, quoted, options) => {
        let message = {
            ...options,
            location: {
                jpegThumbnail: await getBuffer(location),
                degreesLatitude: latitude,
                degreesLongitude: longitude,
                name: name,
                url: url,
                address: address
            }
        }
        return await razzaq.sendMessage(jid, message, { quoted, upload: razzaq.waUploadToServer, ...options })
    };
    razzaq.sendPoll = async(jid, text, list) => {
        return razzaq.relayMessage(jid, { pollCreationMessage: { name: text, options: list.map(v => { return { optionName: v } }), selectableOptionsCount: list.length } }, {})
    };
    /*razzaq.ssweb = async(url, fullPage = false) => {
        const browser = await puppeteer.connect({ browserWSEndpoint: "ws://puppeteer-ws.herokuapp.com/?token=free" })
        const page = await browser.newPage()
        if(!fullPage) {
            await page.setViewport({ width: 800, height: 1360 })
            await page.goto(url)
            await page.waitForTimeout(7000)
            return await page.screenshot()
        } else {
            await page.goto(url)
            await page.waitForTimeout(7000)
            return await page.screenshot()
        };
    };*/
    razzaq.sendPlay = async(from, args, typeArgs, query, prefix, sender, quoted, options) => {
        var url = await yts.search(query)
        url = url.videos[0].url
        
        if(args[0] === typeArgs.private) {
            hxz.youtube(url).then(async(data) => {
                razzaq.sendTBI4(from, `*⚐︎ Id:* ${data.id}\n*⚐︎ Title :* ${data.title}\n*⚐︎ Quality :* ${data.quality}\n*⚐︎ Thumb:* ${data.thumb}`, `Pilih Salah Satu Button Dibawah!`, `${data.thumb}`, `S O U R C E  V I D I O`, `https://youtu.be/${data.id}`, `🎵 Audio (${data.size_mp3})`, `${prefix}ytmp3 ${url}`, `🎥 Video (${data.size})`, `${prefix}ytmp4 ${url}`, `🔍 Search ${data.title}`, `${prefix}ytsearch https://youtu.be/${data.id}`, quoted, options)
            }).catch((err) => {
                razzaq.sendMessage(from, { text: jsonformat(err) });
                configuration.data.jid[1].owner.biography.number.map(() => razzaq.sendMessage(from, { text: `Send Play Error : ${jsonformat(err)}` }));
            });
        } else if(args[0] === typeArgs.group) {
            hxz.youtube(url).then(async(data) => {
                programRojak.sendBI3(from, `*⚐︎ Id:* ${data.id}\n*⚐︎ Title :* ${data.title}\n*⚐︎ Quality :* ${data.quality}\n*⚐︎ Thumb:* ${data.thumb}`, `Pilih Salah Satu Button Dibawah!`, `${data.thumb}`, `${prefix}ytmp3 ${url}`, `🎵 Audio (${data.size_mp3})`, `${prefix}ytmp4 ${url}`, `🎥 Video (${data.size})`, `${prefix}buttons owner`, "OWNER", quoted, options)
            }).catch((err) => {
                razzaq.sendMessage(from, { text: jsonformat(err) });
                configuration.data.jid[1].owner.biography.number.map(() => razzaq.sendMessage(from, { text: `Send Play Error : ${jsonformat(err)}` }));
            }); 
        };
    };
    razzaq.downloadM = async(m, type, filename = '') => {
        if(!m || !(m.url || m.directPath)) return Buffer.alloc(0)
        const stream = await downloadContentFromMessage(m, type)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        };
        if(filename) await fs.promises.writeFile(filename, buffer)
        return filename && fs.existsSync(filename) ? filename : buffer
    };
    razzaq.sendBI = async(jid, contentText, footer, image, buttonId1, displayText1, quoted, options) => {
        let buttonsDefault = [{ 
            buttonId: buttonId1, 
            buttonText: { 
                displayText: displayText1
            }, 
            type: 1 
        }];
        let message = {
            image: { 
                url: image
            },
            caption: contentText,
            footer: footer,
            buttons: buttonsDefault,
            headerType: 4,
            ...options
        };
        return await razzaq.sendMessage(jid, message, { quoted: quoted, ...options })
    };
    razzaq.sendBI2 = async(jid, contentText, footer, image, buttonId1, displayText1, buttonId2, displayText2, quoted, options) => {
        let buttonsDefault = [{ 
            buttonId: buttonId1, 
            buttonText: { 
                displayText: displayText1
            }, 
            type: 1 
        }, {
            buttonId: buttonId2, 
            buttonText: { 
                displayText: displayText2
            }, 
            type: 1 
        }];
        let message = {
            image: { 
                url: image
            },
            caption: contentText,
            footer: footer,
            buttons: buttonsDefault,
            headerType: 4,
            ...options
        };
        return await razzaq.sendMessage(jid, message, { quoted: quoted, ...options })
    };
    razzaq.sendBI3 = async(jid, contentText, footer, image, buttonId1, displayText1, buttonId2, displayText2, buttonId3, displayText3, quoted, options) => {
        let buttonsDefault = [{ 
            buttonId: buttonId1, 
            buttonText: { 
                displayText: displayText1
            }, 
            type: 1 
        }, {
            buttonId: buttonId2, 
            buttonText: { 
                displayText: displayText2
            }, 
            type: 1 
        }, {
            buttonId: buttonId3, 
            buttonText: { 
                displayText: displayText3
            }, 
            type: 1
        }];
        let message = {
            image: { 
                url: image
            },
            caption: contentText,
            footer: footer,
            buttons: buttonsDefault,
            headerType: 4,
            ...options
        };
        return await razzaq.sendMessage(jid, message, { quoted: quoted, ...options })
    };
    razzaq.sendBL = async (jid, contentText, footer, location, buttonId1, displayText1, quoted, options) => {
        let buttonsDefault = [{ 
            buttonId: buttonId1, 
            buttonText: { 
                displayText: displayText1
            }, 
            type: 1 
        }];
        let message = {
            location: { 
                jpegThumbnail: await (await node_fetch(location)).buffer() 
            },
            caption: contentText,
            footer: footer,
            buttons: buttonsDefault,
            headerType: 6,
            ...options
        };
        return await razzaq.sendMessage(jid, message, { quoted: quoted, upload: razzaq.waUploadToServer, ...options })
    };
    razzaq.sendBL2 = async (jid, contentText, footer, location, buttonId1, displayText1, buttonId2, displayText2, quoted, options) => {
        let buttonsDefault = [{ 
            buttonId: buttonId1, 
            buttonText: { 
            displayText: displayText1
            }, 
            type: 1 
        }, { 
             buttonId: buttonId2, 
             buttonText: { 
                displayText: displayText2
            }, 
            type: 1 
        }];
        let message = {
            location: { 
                jpegThumbnail: await (await node_fetch(location)).buffer() 
            },
            caption: contentText,
            footer: footer,
            buttons: buttonsDefault,
            headerType: 6,
            ...options
        };
        return await razzaq.sendMessage(jid, message, { quoted: quoted, upload: razzaq.waUploadToServer, ...options })
    };
    razzaq.sendBL3 = async (jid, contentText, footer, location, buttonId1, displayText1, buttonId2, displayText2, buttonId3, displayText3, quoted, options) => {
        let buttonsDefault = [{ 
            buttonId: buttonId1, 
            buttonText: { 
                displayText: displayText1
            }, 
            type: 1 
        }, { 
            buttonId: buttonId2, 
            buttonText: { 
                displayText: displayText2
            }, 
            type: 1 
        }, { 
            buttonId: buttonId3, 
            buttonText: { 
                displayText: displayText3
            }, 
            type: 1 
        }];
        let message = {
            location: { 
                jpegThumbnail: await (await node_fetch(location)).buffer() 
            },
            caption: contentText,
            footer: footer,
            buttons: buttonsDefault,
            headerType: 6,
            ...options
        };
        return await razzaq.sendMessage(jid, message, { quoted: quoted, upload: razzaq.waUploadToServer, ...options })
    };
    razzaq.sendTBD5 = async (jid, docux, optsDocs, contentText, footer, thumb, linkbuttid1, butturl1, linkbuttid2, butturl2, buttons1, row1, buttons2, row2, buttons3, row3, quoted, options) => {
        const message = {
            document: { url: docux }, ...options,
            jpegThumbnail: await (await node_fetch(thumb)).buffer(), 
            fileName: optsDocs.fileName, 
            mimetype: 'image/png', 
            fileLength: optsDocs.fileLength, 
            pageCount: optsDocs.pageCount,
            caption: contentText,
            footer: footer,
            templateButtons: [{
                urlButton: {
                    displayText: linkbuttid1,
                    url: butturl1
                },
            }, {
                urlButton: {
                    displayText: linkbuttid2,
                    url: butturl2
                },
            }, {
                quickReplyButton: {
                    displayText: buttons1,
                    id: row1
                },
            }, {
                quickReplyButton: {
                    displayText: buttons2,
                    id: row2
                },
            }, {
                quickReplyButton: {
                    displayText: buttons3,
                    id: row3
                },
            }],
        };
        return await razzaq.sendMessage(jid, message, { quoted: quoted, ...options })
    };
    razzaq.sendTBI4 = async (jid, contentText, footer, image, linkbuttid1, butturl1, buttons1, row1, buttons2, row2, buttons3, row3, quoted, options) => {
        const message = {
            image: { url: image }, ...options,
            jpegThumbnail: await (await node_fetch(image)).buffer(),
            caption: contentText,
            footer: footer,
            templateButtons: [{
                urlButton: {
                    displayText: linkbuttid1,
                    url: butturl1
                }
            }, {
                quickReplyButton: {
                    displayText: buttons1,
                    id: row1
                },
            }, {
                quickReplyButton: {
                    displayText: buttons2,
                    id: row2
                },
            }, {
                quickReplyButton: {
                    displayText: buttons3,
                    id: row3
                },
            }]
        };
        return await razzaq.sendMessage(jid, message, { quoted: quoted, ...options })
    };
    razzaq.sendTBI3 = async (jid, contentText, footer, image, linkbuttid1, butturl1, buttons1, row1, buttons2, row2, quoted, options) => {
        const message = {
            image: { url: image }, ...options,
            jpegThumbnail: await (await node_fetch(image)).buffer(),
            caption: contentText,
            footer: footer,
            templateButtons: [{
                urlButton: {
                    displayText: linkbuttid1,
                    url: butturl1
                },
            }, {
                quickReplyButton: {
                displayText: buttons1,
                    id: row1
                },
            }, {
                quickReplyButton: {
                    displayText: buttons2,
                    id: row2
                },
            }]
        };
        return await razzaq.sendMessage(jid, message, { quoted: quoted, ...options })
    };
    razzaq.sendContact = async(jid, contact, quoted = false, opts = {}) => {
        let list = [];
        for (let i of contact) {
            let num = typeof i == "number" ? i + "@s.whatsapp.net" : i;
            let num2 = typeof i == "number" ? i : i.split("@")[0];
            list.push({ displayName: await razzaq.getName(num), vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${await razzaq.getName(num)}\nFN:${await razzaq.getName(num)}\nitem1.TEL;waid=${num2}:${num2}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:${configuration.data.jid[1].owner.social.email}\nitem2.X-ABLabel:Email\nitem3.URL:${configuration.data.jid[1].owner.social.instagram.urlProfile}\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`});
        };
        return razzaq.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list },  ...opts }, { quoted });
    };
    razzaq.sendImageAsSticker = async(jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer;
        if(options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }
        await razzaq.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    };
    razzaq.sendVideoAsSticker = async(jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer;
        if(options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }
        await razzaq.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    };
    if(razzaq.user && await jidNormalizedUser<(razzaq.user.id)) razzaq.user.jid = await jidNormalizedUser(razzaq.user.id)
    razzaq.chats = {}
    razzaq.contacts = {}
    razzaq.logger = {
        ...razzaq.logger,
        info(...args) { 
            console.log(chalk.bold.rgb(57, 183, 16)(`INFO [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.cyan(...args)) 
        },
        error(...args) { 
            console.log(chalk.bold.rgb(247, 38, 33)(`ERROR [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.rgb(255, 38, 0)(...args)) 
        },
        warn(...args) { 
            console.log(chalk.bold.rgb(239, 225, 3)(`WARNING [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.keyword('orange')(...args)) 
        },
    };
    if(m) {
        if(m.key) {
            m.numberLive = 1;
            m.id = m.key.id
            m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16 || m.key.id.startsWith('3EB0') || m.key.id.startsWith('BAE5') || ''
            m.chat = m.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || ''
            m.sender = m.botNumber && await jidNormalizedUser(razzaq.user.id) || m.participant || m.key.participant || m.chat || ''
            m.botNumber = razzaq.decodeJid(m.key?.fromMe);
            m.fromMe = m.botNumber || m.sender, await jidNormalizedUser(razzaq.user.id) || [m.botNumber, configuration.data.jid[1].owner.biography.number].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
            m.isGroup = await isJidGroup(m.chat);
            if(m.isGroup) m.participant = razzaq.decodeJid(m.key.participant) || '';
        };
        if(m.message) {
            m.mtype = await getContentType(m.message) || '';
            m.msg = m.message[m.mtype] || (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[await getContentType(m.message[m.mtype].message)] : m.message[m.mtype]) || '';
            m.body =  (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.listResponseMessage.singleSelectReply.selectedRowId || m.message.buttonsResponseMessage.selectedButtonId || m.text) : '';
            m.command = m.body.slice(1).trim().split(/ +/).shift().toLowerCase();
            m.args = m.body.trim().split(/ +/).slice(1);
            if(m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.chat = (m.key.remoteJid !== 'status@broadcast' && m.key.remoteJid) || m.sender
            if(m.mtype == 'protocolMessage' && m.msg.key) {
                if(m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
                if(!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
                m.msg.key.fromMe = razzaq.decodeJid(m.msg.key.participant) === await jidNormalizedUser(razzaq.user.id)
                if(!m.msg.key.fromMe && m.msg.key.remoteJid === await jidNormalizedUser(razzaq.user.id)) m.msg.key.remoteJid = m.sender
            }
            m.text = m.msg.text || m.msg.caption || m.msg.contentText || m.msg || '' 
            if(typeof m.text !== 'string') {
                if(['protocolMessage', 'messageContextInfo', 'stickerMessage', 'audioMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.text = ''
                else m.text = m.text.selectedDisplayText || m.text.hydratedTemplate?.hydratedContentText || m.text
            }
            m.mentionedJid = m.msg?.contextInfo?.mentionedJid?.length && m.msg.contextInfo.mentionedJid || []
            let quoted = m.quoted = m.msg?.contextInfo?.quotedMessage ? m.msg.contextInfo.quotedMessage : null
            if(m.quoted) {
                let type = await getContentType(quoted)
                m.quoted = m.quoted[type]
                if(['productMessage'].includes(type)) {
                    type = await getContentType(m.quoted)
                    m.quoted = m.quoted[type]
                };
                if(typeof m.quoted === 'string') m.quoted = { text: m.quoted }
                m.quoted.mtype = type
                m.quoted.msg = m.quoted[m.quoted.mtype]
                m.quoted.id = m.msg.contextInfo.stanzaId
                m.quoted.chat = razzaq.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender)
                m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false
                m.quoted.sender = razzaq.decodeJid(m.msg.contextInfo.participant)
                m.quoted.fromMe = m.quoted.sender === razzaq.user.jid
                m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.contentText || ''
                m.quoted.name = await razzaq.getName(m.quoted.sender)
                m.quoted.mentionedJid = m.quoted.contextInfo?.mentionedJid?.length && m.quoted.contextInfo.mentionedJid || []
                m.getQuotedObj = m.getQuotedMessage = async() => {
                    if(!m.quoted.id) return
                    let q = await store.loadMessage(m.chat, m.quoted.id, razzaq)
                    return exports.moduleWA(razzaq, q, store)
                };
                let vM = m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
                    key: {
                        remoteJid: m.quoted.chat,
                        fromMe: m.quoted.fromMe,
                        id: m.quoted.id
                    },
                    message: quoted,
                    ...(m.isGroup ? {
                        participant: m.quoted.sender
                        } : {})
                    });
                m.quoted.delete = () => razzaq.sendMessage(m.quoted.chat, { delete: vM.key })
                m.quoted.copyNForward = (jid, forceForward = false, options = {}) => razzaq.copyNForward(jid, vM, forceForward, options)
                m.quoted.download = () => razzaq.downloadMediaMessage(m.quoted)
            };
            m.name = await razzaq.getName(m.sender) || '';
            m.thumb = await razzaq.profilePictureUrl(m.sender, 'image', 1000).catch(() => 'https://i.ibb.co/31vqq8h/depositphotos-9883921-stock-illustration-no-user-profile-picture.jpg');
            m.groupMetadata = m.isGroup ? await store?.groupMetadata[m.chat] !== undefined ? await store.groupMetadata[m.chat] : await store.fetchGroupMetadata(m.chat, razzaq) : {};
            m.groupMembers = m.isGroup ? m.groupMetadata.participants : [];
            m.groupAdmins = m.groupMembers.filter(v => v.admin !== null).map(x => x.id) || m.groupMembers.filter(v => v.superadmin !== null).map(x => x.id);
            m.isGroupAdmin = m.isOwner || m.groupAdmins.includes(m.sender);
            m.isBotGroupAdmin = m.groupAdmins.includes(m.botNumber);
            m.formattedTitle = m.isGroup ? m.groupMetadata.subject : '';
            m.isBanned = dataREKAP.ban.includes(m.sender);
        };
        m.moment = moment.tz('asia/jakarta').format('HH:mm:ss');
        m.date = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a');
        m.ucapanWaktu = "Selamat " + m.date.charAt(0).toUpperCase() + m.date.slice(1);
        if(m.msg.url) m.download = () => razzaq.downloadMediaMessage(m.msg)
        m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
        m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text) ? razzaq.sendFile(chatId, text, 'file', '', m, { ...options }) : razzaq.reply(chatId, text, m, { ...options })
        m.copy = () => exports.moduleWA(razzaq, proto.WebMessageInfo.fromObject(proto.WebMessageInfo.toObject(m)))
        m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => razzaq.copyNForward(jid, m, forceForward, options)
        try {
            await razzaq.saveName(m.sender, m.name)
            await razzaq.pushMessage(m)
            if(m.isGroup) await razzaq.saveName(m.chat)
        } catch (err) {
            m.reply(util.format(err))
        };
        return m;
    };
};

exports.getFunctions = {
    jsonformat(string) {
        return JSON.stringify(string, null, 2);
    },
    isUrl(url) {
        return new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi).test(url);
    },
    tosmallletters(text) {
        var mapObj = {
            a: "ᵃ", á: "ᵃ", ã: "ᵃ", b: "ᵇ", c: "ᶜ", ç: "ᶜ", d: "ᵈ", e: "ᵉ", é: "ᵉ", ê: "ᵉ", f: "ᶠ", g: "ᵍ",
            h: "ʰ", i: 'ᶦ', j: "ʲ", k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", õ: "ᵒ", ô: "ᵒ", p: "ᵖ", q: "ᑫ",
            r: 'ʳ', s: "ˢ", t: "ᵗ", u: "ᵘ", ú: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ", z: "ᶻ",
            0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹"
        };
        var abreviacoes = Object.keys(mapObj)
        for (let i = 0; i < abreviacoes.length; i++) {
            var regexp = new RegExp(abreviacoes[i], "gi");
            text = text.replace(regexp, mapObj[abreviacoes[i]]);
        }
        return text
    },
    segundosFormatados(seconds) {
        const addZero = (s) => (s < 10 ? '0' : '') + s;

        var hours = Math.floor(seconds / (60 * 60));
        var minutes = Math.floor(seconds % (60 * 60) / 60);
        var seconds = Math.floor(seconds % 60);

        var message = hours == 0
            ? minutes == 0
            ? `${addZero(seconds)}seg` : `${addZero(minutes)}min e ${addZero(seconds)}seg`
            : `${addZero(hours)}h ${addZero(minutes)}min e ${addZero(seconds)}seg`

        return message
    },
    getGroupAdmins(participants) {
        return participants.filter((a) => a.admin == 'admin' || a.admin == 'superadmin')
    },
    getRandom(ext = '') {
        return `${Math.floor(Math.random() * 10000)}${ext}`
    },
    getFuncNameLenth(func) {
        func = func.substring('async '.length);
        func = func.substring(0, func.indexOf('('))
        return func.length + 1
    },
    getFuncDescription(f) {
        var func = f.split('switch (g.cmd.command) {')[1]
        var cases = func.split('default:')[0];
        var funcnames = cases.split(`case '`);
        var descriptions = cases.split('desc=[');
        var names = []
        var response = []
        var currentIndex = descriptions.length
        for (let i = 1; i != currentIndex; i++) {
            if(funcnames[i].length > 60) {
                var name = funcnames[i].split(`':`)[0]
                var desc = ''
                names.push(name)
            } else {
                currentIndex++
            }
        }
        for (let i = 1; i != descriptions.length; i++) {
            var desc = '   _' + descriptions[i].split(']+')[0] + '_'
            response.push({ name: names[i - 1], desc })
        }

        return response
    },
    async getBuffer(url, options) {
        try {
            options ? options : {}
            const res = await axios({
                method: "get",
                url,
                headers: {
                    'DNT': 1,
                    'Upgrade-Insecure-Request': 1
                },
                ...options,
                responseType: 'arraybuffer'
            })
            return res.data
        } catch (e) {
            console.log(`getBuffer error path libs/functions/global : ${e}`)
        }
    },
    downloadFromURL(url, ext = 'jpeg') {
        return new Promise((resolve, reject) => {
            var mediaName = (Math.random() + 1).toString(36).substring(7)
            var path = `./assets/downloads/${mediaName}.${ext}`
            request.head(url, (err, res, body) => {
                request(url).pipe(fs.createWriteStream(path)).on('close', () => resolve(path))
            })
        })
    },
    byteToSize(bytes, decimals = 2) {
        if(bytes === 0) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const size = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + size[i]
    },
    async fetchJson(url, options) {
        try {
            options ? options : {}
            const anu = await axios({
                url,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
                },
                ...options
            })
            return anu.data
        } catch (err) {
            return err
        }
    },
    async urlDirect(url) {
        try {
            return await fetchJson('https://anubis.6te.net/api/getredirect.php?url=' + url)
        } catch (err) {
            console.log(err)
        }
    },
    async urlDirect2(url) {
        return new Promise(async(resolve) => {
            try {
                let a = await startFollowing(url)
                for (let i = 0; i < a.length; i++) {
                    if(a[i].status == 200 && !a[i].redirect){
                        resolve(a[i].url)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        })
    },
    async getSizeMedia(path) {
        return new Promise((resolve, reject) => {
            if(/http/.test(path)) {
                axios({url: path, method: 'GET'})
                .then((res) => {
                    let length = parseInt(res.headers['content-length'])
                    let size = byteToSize(length, 3)
                    if(!isNaN(length)) resolve(size)
                })
            } else if(Buffer.isBuffer(path)) {
                let length = Buffer.byteLength(path)
                let size = byteToSize(length, 3)
                if(!isNaN(length)) resolve(size)
            } else {
                reject('error ngab!')
            }
        })
    },
    kyun(s) {
        pad(s) => {
            return (s < 10 ? '0' : '') + s;
        };
        var hours = Math.floor(s / (60 * 60));
        var minutes = Math.floor(s % (60 * 60) / 60);
        var seconds = Math.floor(s % 60);
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    },
};