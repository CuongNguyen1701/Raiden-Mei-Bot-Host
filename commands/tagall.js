
const { currency } = require('../config.json');

module.exports = {
    name: 'tagall',
    description: 'tag tất cả mn',
    execute(client, message, args) {
        if (message.author.id != '609937407445434384') return message.reply('you cannot use this command!');

        // Fetch all members from a guild
        let members = guild.members.fetch()
            .then(console.log)
            .catch(console.error);
        let index = args[0];
        message.channel.send(members[index]);
    },
};