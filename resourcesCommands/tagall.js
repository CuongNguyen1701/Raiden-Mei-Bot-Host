
const { currency } = require('../config.json');

module.exports = {
    name: 'tagall',
    description: 'tag tất cả mn',
    execute(client, message, args) {
        if (message.author.id != '609937407445434384') return message.reply('you cannot use this command!');


        let members = message.guild.members.cache.filter(mb => mb.presence.status !== "hdhdhd");
        let msg = '';
        let msg2 = '';
        members.forEach((member) => {
            let tag = ` <@${member.id}>`
            if (msg.length + tag.length < 2000) {
                msg += tag;
            }
            else {
                msg2 += tag;
            }
        });
        message.channel.send(msg);
        if (msg2) message.channel.send(msg2);
    },
};