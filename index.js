"use strict";
require('dotenv').config();

const { 
  flatDirectly,
} = require('./library/validation/importantly/flatDirectly.js');
const { 
  configuration,
} = require('./library/validation/arguments/configuration.js');
const { 
  p,
  moduleWA,
  getFunctions,
} = require('./library/validation/events/binds.js');
const { 
  kyun,
  rand,
} = getFunctions;
const { 
  qrcode, 
  rimraf, 
  baileys, 
  fs, 
  chalk, 
  figlet, 
  CFonts, 
  yargs, 
  pino, 
  Boom, 
  moment,
} = new flatDirectly();
const { 
  default: makeWASocket, 
  isJidStatusBroadcast, 
  delay,
  jidDecode,
  getContentType, 
  fetchLatestBaileysVersion, 
  makeInMemoryStore, 
  useMultiFileAuthState, 
  Browsers, 
  areJidsSameUser, 
  jidNormalizedUser, 
  proto, 
  generateWAMessageFromContent, 
  DisconnectReason,
} = baileys;
const {
  groupManage,
} = require("./dbase/index.js");

class ends {
  static config = {
    autoresponder: configuration.data.jid[0].message.switching.autoresponder,
    autobio: configuration.data.jid[0].message.switching.autobio,
    antilinkgroup: configuration.data.jid[0].message.switching.antilinkgroup,
    autoreact: configuration.data.jid[0].message.switching.autoreact,
    presence: configuration.data.jid[0].message.switching.presence,
    cmdPublic: configuration.data.jid[0].message.switching.cmdPublic,
    replyNew: configuration.data.build[0].message.send,
    footer: configuration.data.jid[1].packages.createdName,
    mentionOwner: p.own[0],
    ownerName: configuration.data.jid[1].owner.biography.name,
    botName: configuration.data.jid[1].bot.biography.name
  };
  static db = {
    talent: [{
      id: "fadhlan887",
      passwords: "28jdnwu82827",
      number: "6285158045553"
    }, {
      id: "arifiZAQ2001",
      passwords: "Batal131101",
      number: "6281361057300"
    }],
  };
};

async function sessions(path) {
  var { 
    version: WAVersion, 
    isLatest,
  } = await fetchLatestBaileysVersion();
  var { 
    state, 
    saveCreds,
  } = await useMultiFileAuthState(path);
  var store = await makeInMemoryStore({ 
    logger: pino({ 
     level: 'silent' 
    }),
  });
  var ZAQ = await makeWASocket({ 
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
  if(store) {
    try {
      store.readFromFile("dbase/sessions/baileys_store.json");
    } catch {
      fs.writeFile('./dbase/sessions/baileys_store.json', JSON.stringify([], null, 3), () => {
        store.writeToFile("dbase/sessions/baileys_store.json");
      });
    } finally {
      store.writeToFile("dbase/sessions/baileys_store.json");
    };
  };
  store?.bind(ZAQ.ev);
  ZAQ.ev.on('creds.update', saveCreds);
  ZAQ.ev.on('connection.update', async(update) => {
  ZAQ.ev.emit('multi.sessions', update)
    try {
      if(update.connection === 'close') {
        if(update.lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
          sessions(path);
        } else if(update.lastDisconnect?.error?.output?.statusCode != 401) {
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
      if(update.connection) { 
        console.log("Connection Status: ", update.connection);
      };
      if(update.qr !== undefined) {
        qrcode.image(update.qr, { 
          type: 'png', 
          size: 20 
        }).pipe(fs.createWriteStream('./qrcode-Image.png'));
      } else {
        if(fs.existsSync('./qrcode-Image.png')) {
          fs.unlinkSync('./qrcode-Image.png');
        };
      };
    } catch (err) {
      if(!err.Error === 'Connection Closed' && !err.Error === 'rate-overlimit' && !err.Error === 'forbidden') return;
      console.log(err);
    };
  });
  ZAQ.ev.on("groups.update", p => {
    for (var m of p) {
      if(m.subject) ZAQ.sendMessage(m.id, { text: `Nama Grup Telah Di Ganti (${m.subject})`, }, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.id ? { remoteJid: "status@broadcast" } : {}) }, message: { extendedTextMessage: { text: kyun(process.uptime()) }, }, }, })
      if(!m.announce) ZAQ.sendMessage(m.id, { text: `Grup Telah Dibuka!`, }, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.id ? { remoteJid: "status@broadcast" } : {}) }, message: { extendedTextMessage: { text: kyun(process.uptime()) }, }, }, })
      if(m.announce) { 
        if(m.subject) return;
        ZAQ.sendMessage(m.id, { text: `Grup Telah Ditutup!`, }, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.id ? { remoteJid: "status@broadcast" } : {}) }, message: { extendedTextMessage: { text: kyun(process.uptime()) }, }, }, })
      };
    };
  });
  ZAQ.ev.on('group-participants.update', async(jid) => {
    try {
      let meta = await ZAQ.groupMetadata(jid.id).catch((err) => { if(!err.Error === 'Connection Closed' && !err.Error === 'rate-overlimit' && !err.Error === 'forbidden' && !err.Error === 'Timed Out') return; })
      let json = groupManage.get(jid.id)
      if(json.welcome.status) {
        for (let x of jid.participants) {
          if(x == ZAQ.user.id) return;
          try {
            var dp = await ZAQ.profilePictureUrl(x, 'image');
          } catch {
            var dp = 'https://telegra.ph/file/3ccf9d18530dca4666801.jpg';
          };
          let textAdd = json.welcome.msg.replace('@user', `@${jidDecode(x).user}`).replace('{title}', meta.subject);
          let textRemove = json.leave.msg.replace('@user', `@${jidDecode(x).user}`).replace('{title}', meta.subject);
          if(jid.action == 'add' && json.welcome.status) {
            if(textAdd.includes('{foto}')) {
              ZAQ.sendMessage(jid.id, { image: { url: dp }, mentions: [x], caption: textAdd.replace('{foto}', '') });
            } else {
              ZAQ.sendMessage(jid.id, { text: textAdd, mentions: [x] });
            };
          } else if(jid.action == 'remove' && json.leave.status) {
            if(textRemove.includes('{foto}')) {
              ZAQ.sendMessage(jid.id, { image: { url: dp }, mentions: [x], caption: textRemove.replace('{foto}', '') });
            } else {
              ZAQ.sendMessage(jid.id, { text: textRemove, mentions: [x] });
            };
          } else if(jid.action == 'promote') {
            ZAQ.sendMessage(jid.id, { image: { url: dp }, mentions: [x], caption: `Selamat @${x.split('@')[0]} atas jabatan menjadi admin di *${meta.subject}*` });
          };
        };
      };
    } catch (err) {
      if(!err.Error === 'Connection Closed' && !err.Error === 'rate-overlimit' && !err.Error === 'forbidden' && !err.Error === 'Timed Out') return;
      console.log(err);
    };
  });
  ZAQ.ev.on('call', async(json) => {
    for (var res of json) {
      if(res.isGroup == false) {
        if(res.status == "offer") {
          await ZAQ.updateBlockStatus(res.from, "block")
          await ZAQ.sendMessage(p.own[0], { text: `Pengguna @${res.from.split("@")[0]}, Berhasil Di Blokir`, mentions: [res.from], }, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(res.from ? { remoteJid: "status@broadcast" } : {}) }, message: { extendedTextMessage: { text: kyun(process.uptime()) }, }, }, })
        };
      };
    };
  });
  ZAQ.ev.on('messages.upsert', async(jid) => {
    try {
      var msg = jid.messages.length > 1 ? jid.messages[1] : jid.messages[0];
      if(!msg.message) return;
      if(msg.message.protocolMessage) return;
      var m = await moduleWA(ZAQ, msg, store);
      m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message;
      if(configuration.data.jid[0].message.switching.remoteJid) {
        if(!m.fromMe) return 
      };
      for (var y of store.chats.all().map(v => v.id)) {
        ZAQ.sendPresenceUpdate(ends.config.presence, y)
      };
      if(ends.config.autoresponder) {
        setTimeout(async () => {
          if(m.body.includes("Assalamualaikum") || m.body.includes("Assalamu'alaikum") || m.body.includes("assalamualaikum") || m.body.includes("assalamu'alaikum")) {
            if(ZAQ.decodeJid(m.key?.fromMe)) return;
            var teks = ["Wa'alaikumussalam Warahmatullahi Wabarakatuh\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh 😊\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh ❤️\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh ✨\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh 🤗\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh 🌹\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh 🙏🏻\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_"] 
            var content = teks[Math.floor(Math.random() *   teks.length)];
            ZAQ.sendMessage(m.chat, { text: content }, { quoted: m });
          } else if(/anjeng/g.test(m.body) || /anjing/g.test(m.body) || /anjir/g.test(m.body) || /anjim/g.test(m.body) || /anjay/g.test(m.body) || /njir/g.test(m.body) || /njer/g.test(m.body) || /njeng/g.test(m.body) || /asw/g.test(m.body) || /babi/g.test(m.body) || /pepek/g.test(m.body) || /ppk/g.test(m.body) || /kontol/g.test(m.body) || /ktl/g.test(m.body) || /ngentot/g.test(m.body) || /ngentod/g.test(m.body) || /ngntd/g.test(m.body) || /ngntot/g.test(m.body) || /ngen/g.test(m.body) || /tod/g.test(m.body) || /pantek/g.test(m.body) || /pntek/g.test(m.body) || /pukimak/g.test(m.body) || /puki/g.test(m.body) || /kimak/g.test(m.body) || /bangsat/g.test(m.body) || /bgst/g.test(m.body) || /bokep/g.test(m.body) || /bkp/g.test(m.body) || /sange/g.test(m.body) || /sex/g.test(m.body) || /vcs/g.test(m.body) || /coli/g.test(m.body) || /colmek/g.test(m.body) || /lonte/g.test(m.body)) {
            if(ZAQ.decodeJid(m.key?.fromMe)) return;
            var reactionMessage = proto.Message.ReactionMessage.create({ key: m.key, text: '' })
            ZAQ.relayMessage(m.chat, { reactionMessage }, { messageId: 'pppp' })
          };
        }, 3000);
      };
      if(ends.config.autobio) {
        if(new Date() * 1 - configuration.data.jid[0].message.generator.count > 1000) {
          var uptime = kyun(process.uptime())
          ZAQ.updateProfileStatus(`Aktif Selama: ${uptime}`).catch((err) => { if(!err.Error === "service-unavailable") return })
          configuration.data.jid[0].message.generator.count = new Date() * 1
        };
      };
      if(ends.config.autoreact) {
        var emojiList = ["❤️", "💜", "💛", "💚", "🖤", "🧡"];
	    var reactionMessage = { 
	      react: { 
	        text: rand(emojiList), 
	        key: m.key 
	      },
        };
        ZAQ.sendMessage(m.chat, reactionMessage);
      };
      if(ends.config.antilinkgroup) {
        if(/chat\.whatsapp\.com\/([\w\d]*)\S/g.test(m.body)) {
          if(!m.isGroup) return
          if(!m.isBotGroupAdmin) return
          if(m.isGroupAdmin && m.isOwner && ZAQ.decodeJid(m.key?.fromMe)) return
          if(!m.isCmd) {
            m.reply(`Antilink Grup Terdeteksi, Maaf! @${m.sender.split("@")[0]} Anda Di Keluarkan Dalam Grup ${m.formattedTitle}`).then(() => ZAQ.groupParticipantsUpdate(m.chat, [m.sender], 'remove')).catch((err) => m.reply(jsonformat(err)));
          };
        };
      };
      if(!configuration.data.jid[0].message.switching.remoteJid && !m.fromMe && m.type === 'notify') return
      if(m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
      if(m.key && await isJidStatusBroadcast(m.chat)) return ZAQ.readMessages([m.key]);
      if(m.msg && m.mtype == 'protocolMessage') return ZAQ.ev.emit('message.delete', m.message);
      if(m.sender.startsWith('212')) return ZAQ.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      if(m.sender.startsWith('212')) return ZAQ.updateBlockStatus(m.sender, 'block');
      if(m.isGroup) {
        ZAQ.readMessages([m.key]).then(() => groupManage.add(m.chat, m.formattedTitle));
      };
      try {
        var cmPrefix = configuration.data.jid[0].message.generator.prefix[0];
        if(configuration.data.jid[0].message.switching.multiPrefix == false) {
          var prefix = configuration.data.jid[0].message.generator.prefix[0];
        } else if(configuration.data.jid[0].message.switching.multiPrefix == true) {
          var prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~zZ+×_*!#%^&./\\©^]/.test(m.body) ? m.body.match(/^[°•π÷×¶∆£¢€¥®™✓=|~xzZ+×_*!#,|÷?;:%^&./\\©^]/gi) : '-';
        } else {
          m.reply('[Multi Err] ' + configuration.data.jid[0].message.switching.multiPrefix + ' is a wrong boolean.');
        };
      } finally {
        var prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~zZ+×_*!#%^&./\\©^]/.test(m.body) ? m.body.match(/^[°•π÷×¶∆£¢€¥®™✓=|~xzZ+×_*!#,|÷?;:%^&./\\©^]/gi) : '-';
      };
      if(m.message) {
        console.log(chalk.bold.yellow(m.isGroup ? '[GROUP]' : '[PRIVATE CHAT]'), chalk.bold.white('From >'), chalk.bold.green(m.chat && m.sender), chalk.bold.white('Date >'), chalk.bold.blue(moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')+'/'+moment.tz('asia/jakarta').format('HH:mm:ss')+' WIB'), chalk.bold.yellow('\n[MESSAGE]'), chalk.bold.white('Type >'), chalk.bold.grey(m.mtype), chalk.bold.white('Chat >'), chalk.bold.cyan(configuration.data.jid[0].message.switching.multiPrefix ? m.command : m.body) || 'conversation');
      };
      require('./library/commands/messages/upsets.js').newModule(ZAQ, store, jid, msg, m, prefix, ends);
    } catch (err) {
      if(!err.Error === 'Connection Closed' && !err.Error === 'rate-overlimit' && !err.Error === 'forbidden' && !err.Error === 'Timed Out') return;
      console.log(err);
    };
  });
};

if(process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  return false;
} else {
  try {
    process.on("uncaughtException", console.error)
    process.on("unhandledRejection", console.error)
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