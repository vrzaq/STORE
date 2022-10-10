"use strict";
require('dotenv').config();

exports.configuration = class configuration {
    static data = {
        jid: [{ 
            message: {
                costumeText: {
                    welcome: {
                        status: true,
                        msg: "Welcome @user in group {title}"
                    },
                    leave: {
                        status: true,
                        msg: "Good bye @user"
                    },
                },
                switching: {
                    autobio: true,
                    autoRead: true,
                    autoresponder: true,
                    autoreact: false,
                    autorecording: false,
                    antilink: false,
                    antilinkyoutube: false,
                    antiDeleteKey: false,
                    welcome: false,
                    kuis: false,
                    multiPrefix: false,
                    remoteJid: false,
                    cmdPublic: true
                }, 
                generator: {
                    prefix: [ "#" ],
                    maxFileSize: 30.0,
                    count: 0
                }, 
            },  
        }, { 
            owner: {
                social: {
                    email: "vr.zaq1@gmail.com",
                    instagram: {
                        name: "arifirazzaq2001",
                        urlProfile: "https://instagram.com/arifirazzaq2001"
                    },
                    youtube: {
                        name: "Arifi Razzaq Ofc",
                        urlChannel: "https://youtube.com/channel/UCDg78Y5CdM6VDezW0G_ddlw"
                    },
                },
                biography: {
                    name: "Arifi Razzaq",
                    number: [ "6281361057300", "6287755616748" ]
                },
            },
            bot: {
                biography: {
                    name: "么 RAZZAQ BOT"
                },
            },
            packages: {
                createdName: "Created By @"
            },
            donate: {
                rekening: {
                    bri: "BRI: [ 5320-01-018862-53-6 ]",
                    bca: "BCA: [String]",
                    bsi: "BSI: [String]",
                    bni: "BNI: [String]",
                    btpn: "BTPN: [String]",
                    mandiri: "MANDIRI: [String]",
                    permata: "PERMATA: [String]",
                    panin: "PANIN: [String]",
                    cimbniaga: "CIMB NIAGA: [String]",
                    ocbcnisp: "OCBC NISP: [String]"
                },
                pulsa: {
                    telkomsel: "TELKOMSEL: [ 0813-6105-7300 ]",
                    smartfren: "SMARTFREN: [String]",
                    xl: "XL: [String]",
                    axis: "AXIS: [String]",
                    tri: "TRI: [String]",
                    indosat: "INDOSAT: [String]"
                },
                application: {
                    gopay: "GOPAY: [ 0813-6105-7300 ]",
                    ovo: "OVO: [ 0813-6105-7300 ]",
                    dana: "DANA: [ 0813-6105-7300 ]",
                    saweria: "SAWERIA: [ 0813-6105-7300 ]"
                },
            },
        }, {
            exif: {
                packname: class packname {
                    static contents = (options) => {
                        var obj = [{
                            text: options.text,
                            descriptions: options.descriptions
                        }];
                        return obj[0].text || obj[0].descriptions
                    };
                },
            },
        }], 
        build: [{
            message: {
                send: class send {
                    static fail = (type, m) => {
                        var msg = {
                            grup: "Khusus Dalam Grup!",
                            admin: "Khusus Admin Grup!",
                            adminB: "Bot Harus Menjadi Admin!",
                            pemilik: "Khusus Owner Bot!",
                            publik: "Bot Sekarang Dalam Mode Self!",
                            banned: "Maaf, Anda Di Banned! Silahkan Hubungi Developer Bot Untuk Membukanya.",
                            tautan: "Format Link Tidak Di temukan!",
                            teks: "Forman Text Tidak Di Temukan!",
                            jumlahK: "Gagal!, Jumlah Pengiriman Belum Di Isi!",
                        }[type]
                        if(msg) return m.reply(msg)
                    };
                    static succeed = (type, m) => {
                        var msg = {
                            hasil: "Berhasil!, Berikut Adalah Hasilnya..."
                        }[type]
                        if(msg) return m.reply(msg)
                    };
                    static wait = (type, m) => {
                        var msg = {
                            proses: "Permintaan Anda Sedang Di Proses!, Mohon Tunggu Sebentar..."
                        }[type]
                        if(msg) return m.reply(msg)
                    };
                },
            },
            newModule: {
                Reply: class Reply {
                    constructor(jid, text, options = {}) {
                        this.jid = jid;
                        this.text = text;
                    };
                    static send = async(razzaq, m) => {
                        function send() {
                            razzaq.sendMessage(this.jid, { text: this.text }, { quoted: m });
                        };
                        return send(razzaq, m)
                    };
                },
            },
        }],
    };
};