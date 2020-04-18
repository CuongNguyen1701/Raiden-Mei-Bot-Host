const fs = require('fs');
const money = require('../money.json');
const {currency} = require('../config.json');

module.exports = {
	name: 'adreborn',
	description: 'tái sinh(kể cả người khác) bằng mazik, tiền về 100' + currency ,
	execute(client, message, args) {
        if(message.author.id != '609937407445434384') return message.reply('you cannot use this command!');

        if(!args[0]){
            var user = message.author;

        }else{
            var user = message.mentions.users.first() || client.users.cache.get(args[0]); 
        }
        let roleMember = message.guild.member(user);
        try
        {
        roleMember.roles.remove(role.tier1.id);
        roleMember.roles.remove(role.tier2.id);
        roleMember.roles.remove(role.tier3.id);
        roleMember.roles.remove(role.tier4.id);
        roleMember.roles.remove(role.tier5.id);
        roleMember.roles.remove(role.tier6.id);
        roleMember.roles.remove(role.tier7.id);
        roleMember.roles.remove(role.tier8.id);
        roleMember.roles.remove(role.tier9.id);
        roleMember.roles.remove(role.tier10.id);
        }
        catch
        {
            
        }
            money[user.id].money = 100;
            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if(err) console.log('error', err);
            });
        
        message.channel.send(client.users.cache.get(user.id).username + ' has been reborn with ' + money[user.id].money + currency + ' by ' + message.author.username);
	},
};