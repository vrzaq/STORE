const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

var db = new JsonDB(new Config("dbase/db", true, true, '/'));

let stats = {
    msgSent: 1,
    msgRecv: 1,
    filesize: 1,
    autodownload: 1,
    sticker: 1,
    cmd: 1
}
if (!db.exists('/stats')) db.push('/stats', stats)
if (!db.exists('/groups')) db.push('/groups/123-456@g.us', {
    id: '123-456@g.us',
    groupName: 'jirolu',
    antilink: false,
    mute: false
})
if (!db.exists('/afk')) db.push('/afk[]', { jid: '123@c.us', groupId: '123-456@g.us', groupName: 'jirolu', timestamp: Date.now(), reason: 'ngising' })
if (!db.exists('/config')) db.push('/config', {
    session_id: '',
    removeBG: '',
    musixMatch: ''
})

exports.groupManage = {
    add: (groupId, groupName) => {
        if (db.exists(`/groups/${groupId}`)) return false
        let json = {
            id: groupId,
            groupName,
            antilink: false,
            mute: false,
            welcome: {
                status: true,
                msg: 'Welcome @user in group {title}'
            },
            leave: {
                status: true,
                msg: 'Good bye @user'
            }
        }
        db.push(`/groups/${groupId}`, json)
        return json
    },
    update: (groupId, args) => {
        db.push(`/groups/${groupId}`, args)
    },
    get: (groupId) => {
        if (!db.exists(`/groups/${groupId}`)) return false
        else return db.getData(`/groups/${groupId}`)
    }

}