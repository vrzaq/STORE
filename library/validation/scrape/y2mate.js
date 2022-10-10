"use strict";
require('dotenv').config();

const { flatDirectly, regex } = require('../importantly/flatDirectly.js');
const { configuration } = require('../arguments/configuration.js');
const { jsdom, node_fetch, node_webpmux, fluent_ffmpeg, crypto, os, fs, chalk, path, child_process, yargs, util, baileysUtils, jimp, FileType } = new flatDirectly();
const { ytIdRegex } = new regex;
const { tmpdir } = os;
const { JSDOM } = jsdom;
    
async function post(url, formdata) {
    return node_fetch(url, {
        method: 'POST',
        headers: {
            accept: "*/*",
            'accept-language': "en-US,en;q=0.9",
            'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(Object.entries(formdata))
    })
}

async function yt(url, quality, type, bitrate, server = 'en68') {
    let ytId = ytIdRegex.exec(url)
    url = 'https://youtu.be/' + ytId[1]
    let res = await post(`https://www.y2mate.com/mates/${server}/analyze/ajax`, {
        url,
        q_auto: 0,
        ajax: 1
    })
    let json = await res.json()
    let { document } = (new JSDOM(json.result)).window
    let tables = document.querySelectorAll('table')
    let table = tables[{ mp4: 0, mp3: 1 }[type] || 0]
    let list
    switch (type) {
        case 'mp4': {
            list = Object.fromEntries([...table.querySelectorAll('td > a[href="#"]')].filter(v => !/\.3gp/.test(v.innerHTML)).map(v => [v.innerHTML.match(/.*?(?=\()/)[0].trim(), v.parentElement.nextSibling.nextSibling.innerHTML]))
        }
        break
        case 'mp3': {
            list = { 
                '128kbps': table.querySelector('td > a[href="#"]').parentElement.nextSibling.nextSibling.innerHTML
            }
        }
        break
    default:
        list = {}
    }
    let filesize = list[quality]
    let id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
    let thumb = document.querySelector('img').src
    let title = document.querySelector('b').innerHTML
    let res2 = await post(`https://www.y2mate.com/mates/${server}/convert`, {
        type: 'youtube',
        _id: id[1],
        v_id: ytId[1],
        ajax: '1',
        token: '',
        ftype: type,
        fquality: bitrate
    })
    let json2 = await res2.json()
    let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
    let resUrl = /<a.+?href="(.+?)"/.exec(json2.result)[1]
    return {
        dl_link: resUrl.replace(/https/g, 'http'),
        thumb,
        title,
        filesizeF: filesize,
        filesize: KB
    }
}

module.exports = {
    yt,
    ytIdRegex,
    yta(url, resol = '128kbps', server = 'en154') { 
        return yt(url, resol, 'mp3', resol.endsWith('kbps') ? resol.replace(/kbps/g, '') : resol, server) 
    },
    ytv(url, resol = '360p', server = 'en154') { 
        return yt(url, resol, 'mp4', resol.endsWith('p') ? resol.replace(/p/g, '') : resol, server) 
    },
    servers: ['en136', 'id4', 'en60', 'en61', 'en68']
}