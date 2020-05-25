
const { currency } = require('../config.json');

module.exports = {
    name: 'tagall',
    description: 'tag tất cả mn',
    execute(client, message, args) {
        if (message.author.id != '609937407445434384') return message.reply('you cannot use this command!');


        let members = message.guild.members.filter(mb => mb.presence.status !== "hdhdhd")
            .catch(console.error);
        let msg = '';
        members.forEach((member) => {
            msg += ` ${member.id}`;
        });
        message.channel.send(msg);
    },
};