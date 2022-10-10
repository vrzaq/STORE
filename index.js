"use strict";
require('dotenv').config();

const { flatDirectly } = require('./library/validation/importantly/flatDirectly.js');
const { configuration } = require('./library/validation/arguments/configuration.js');
const { moduleWA } = require('./library/validation/events/binds.js');
const { qrcode, rimraf, baileys, fs, chalk, figlet, CFonts, yargs, pino, Boom, moment } = new flatDirectly();
const { default: makeWASocket, isJidStatusBroadcast, getContentType, fetchLatestBaileysVersion, makeInMemoryStore, useMultiFileAuthState, Browsers, areJidsSameUser, jidNormalizedUser, proto, generateWAMessageFromContent, DisconnectReason } = baileys;

async function sessions(path) {
    try {
        var { version: WAVersion, isLatest } = await fetchLatestBaileysVersion();
        var { state, saveCreds } = await useMultiFileAuthState(path);
        var store = await makeInMemoryStore({ 
            logger: pino({ 
                level: 'silent' 
            }),
        });
        var razzaq = await makeWASocket({ 
            version: WAVersion, 
            logger: pino({ 
                level: 'silent' 
            }), 
            printQRInTerminal: true, 
            auth: state, 
            msgRetryCounterMap: {}, 
            syncFullHistory: true,
            keepAliveIntervalMs: 60000,
            browser: Browsers.appropriate(configuration.data.jid[1].owner.biography.name),
            getMessage: async key => {
                if(store) {
                    var msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg?.message || undefined;
                };
                return {
                    conversation: 'Terjadi Kesalahan, Ulangi Command!',
                };
            },
        });
        store?.bind(razzaq.ev);
        store.readFromFile('./dbase/sessions/baileys_store.json');
        setInterval(() => {
            store.writeToFile('./dbase/sessions/baileys_store.json');
        }, 10_000);
        
        razzaq.ev.on('connection.update', async (update) => {
            var { connection, lastDisconnect, qr } = update;
            if(connection === 'close') {
                if(lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                    sessions(path);
                } else {
                    try {
                        rimraf(".state", function () { 
                             console.log("done"); 
                        });
                        if(fs.existsSync('./dbase/sessions/baileys_store.json')) {
                             fs.unlinkSync('./dbase/sessions/baileys_store.json');
                        };
                    } finally {
                        sessions(path);
                    };
                };
            };
            if(connection) { 
                console.log("Connection Status: ", connection);
            };
            if(qr !== undefined) {
                qrcode.image(qr, { type: 'png', size: 20 }).pipe(fs.createWriteStream('./qrcode-Image.png'));
            } else {
                if(fs.existsSync('./qrcode-Image.png')) {
                    fs.unlinkSync('./qrcode-Image.png');
                };
            };
        });
        razzaq.ev.on('creds.update', saveCreds);
        razzaq.ev.on('group-participants.update', async (jid) => {
            try {
                let meta = await razzaq.groupMetadata(jid.id);
                if(configuration.data.jid[0].message.switching.welcome) {
                    for (let x of jid.participants) {
                        if(x == razzaq.user.id) return;
                        try {
                            var dp = await razzaq.profilePictureUrl(x, 'image');
                        } catch {
                            var dp = 'https://telegra.ph/file/3ccf9d18530dca4666801.jpg';
                        };
                        let textAdd = configuration.data.jid[0].message.costumeText.welcome.jid.replace('@user', `@${jidDecode(x).user}`).replace('{title}', meta.subject);
                        let textRemove = configuration.data.jid[0].message.costumeText.leave.jid.replace('@user', `@${jidDecode(x).user}`).replace('{title}', meta.subject);
                        if(jid.action == 'add' && configuration.data.jid[0].message.costumeText.leave.status) {
                            if(textAdd.includes('{foto}')) {
                                razzaq.sendMessage(jid.id, { image: { url: dp }, mentions: [x], caption: textAdd.replace('{foto}', '') });
                            } else {
                                razzaq.sendMessage(jid.id, { text: textAdd, mentions: [x] });
                            };
                        } else if(jid.action == 'remove' && configuration.data.jid[0].message.costumeText.leave.status) {
                            if(textRemove.includes('{foto}')) {
                                razzaq.sendMessage(jid.id, { image: { url: dp }, mentions: [x], caption: textRemove.replace('{foto}', '') });
                            } else {
                                razzaq.sendMessage(jid.id, { text: textRemove, mentions: [x] });
                            };
                        } else if(jid.action == 'promote') {
                            razzaq.sendMessage(jid.id, { image: { url: dp }, mentions: [x], caption: `Selamat @${x.split('@')[0]} atas jabatan menjadi admin di *${meta.subject}*` });
                        };
                    };
                };
            } catch (err) {
                if(err.Error === 'Connection Closed') {
                    return;
                }
                console.log(err)
            };
        });
        razzaq.ev.on('messages.upsert', async (jid) => {
            try {
                var msg = jid.messages.length > 1 ? jid.messages[1] : jid.messages[0];
                if(!msg.message) return
                if(msg.message.protocolMessage) return
                var m = await moduleWA(razzaq, msg, store);
                m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message;
                if(configuration.data.jid[0].message.switching.remoteJid) {
                    if(!m.fromMe) return 
                };
                if(!configuration.data.jid[0].message.switching.remoteJid && !m.fromMe && m.type === 'notify') return
                if(m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
                if(m.key && await isJidStatusBroadcast(m.chat)) return razzaq.readMessages([m.key]);
                if(m.msg && m.mtype == 'protocolMessage') return razzaq.ev.emit('message.delete', m.message);
                if(m.sender.startsWith('212')) return razzaq.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                if(m.sender.startsWith('212')) return razzaq.updateBlockStatus(m.sender, 'block');
                try {
                    var cmPrefix = configuration.data.jid[0].message.generator.prefix[0];
                    if(configuration.data.jid[0].message.switching.multiPrefix == false) {
                        var prefix = configuration.data.jid[0].message.generator.prefix[0];
                    } else if(configuration.data.jid[0].message.switching.multiPrefix == true) {
                        var prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~zZ+×_*!#%^&./\\©^]/.test(m.body) ? m.body.match(/^[°•π÷×¶∆£¢€¥®™✓=|~xzZ+×_*!#,|÷?;:%^&./\\©^]/gi) : '-';
                    } else {
                        console.log('[Multi Err] ' + configuration.data.jid[0].message.switching.multiPrefix + ' is a wrong boolean.');
                    };
                } finally {
                    var cmPrefix = configuration.data.jid[0].message.generator.prefix[0];
                };
                if(m.message) {
                    if(m.isGroup) {
                        await razzaq.readMessages([m.key]);
                    };
                    console.log(chalk.bold.yellow(m.isGroup ? '[GROUP]' : '[PRIVATE CHAT]'), chalk.bold.white('From >'), chalk.bold.green(m.chat && m.sender), chalk.bold.white('Date >'), chalk.bold.blue(moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')+'/'+moment.tz('asia/jakarta').format('HH:mm:ss')+' WIB'), chalk.bold.yellow('\n[MESSAGE]'), chalk.bold.white('Type >'), chalk.bold.grey(m.mtype), chalk.bold.white('Chat >'), chalk.bold.cyan(configuration.data.jid[0].message.switching.multiPrefix ? m.command : m.body) || 'conversation');
                };
                require('./library/commands/messages/upsets.js').newModule(razzaq, store, jid, msg, m, prefix);
            } catch (err) {
                console.log(err);
            };
        });
    } catch (err) {
        console.log(err);
    };
};

if(process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
    return false;
} else {
    try {
        process.on("uncaughtException", console.warn);
    } finally {
        sessions('./dbase/sessions').then(() => console.log(chalk.hex('#FF8800').bold(figlet.textSync(configuration.data.jid[1].owner.biography.name, { font: 'Standard', horizontalLayout: 'default', vertivalLayout: 'default', width: 80, whitespaceBreak: false }), ), ), ).catch(console.warn);
    };
};

fs.watchFile(require.resolve(__filename), () => {
    fs.unwatchFile(require.resolve(__filename));
    console.log(chalk.redBright(require.resolve(__filename)));
    delete require.cache[require.resolve(__filename)];
  	require(require.resolve(__filename));
});