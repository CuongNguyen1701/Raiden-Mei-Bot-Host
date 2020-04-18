const fs = require('fs');
const money = require('../money.json');
const faction = require('../faction.json');
const {currency} = require('../config.json');
const role = require('../roles.json');

module.exports = {
	name: 'faction',
	description: 'xem nhóm',
	execute(client, message, args) {

        if(!args[0]){
            var user = message.author;
        }else{
            var user = message.mentions.users.first() || client.users.cache.get(args[0]); 
        }
        if(!faction[user.id]) return message.reply(client.users.cache.get(user.id).username + " isn't in any faction!");


        return message.channel.send(client.users.cache.get(user.id).username + ' is in ' + faction[user.id].faction + ' faction!');


    },
};