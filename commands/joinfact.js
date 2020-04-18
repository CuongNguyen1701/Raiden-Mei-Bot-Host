const fs = require('fs');
const money = require('../money.json');
const faction = require('../faction.json');
const {currency} = require('../config.json');
const role = require('../roles.json');

module.exports = {
	name: 'joinfact',
	description: 'tham gia nhóm',
	execute(client, message, args) {
        let roleMember = message.guild.member(message.author);
        let user = message.author;
        if(!faction[user.id]) 
        {
            faction[user.id] = {
                name: client.users.cache.get(user.id).tag
            }
        }
        if(faction[user.id].faction) return message.reply('you have already joined a faction!');

        if( money[message.author.id].money >= role.tier2.cost && (roleMember.roles.cache.has(role.tier2.id) 
        || roleMember.roles.cache.has( role.tier3.id)|| roleMember.roles.cache.has( role.tier4.id)|| roleMember.roles.cache.has( role.tier5.id)
        || roleMember.roles.cache.has( role.tier6.id)|| roleMember.roles.cache.has( role.tier7.id)|| roleMember.roles.cache.has( role.tier8.id)
        || roleMember.roles.cache.has( role.tier9.id)|| roleMember.roles.cache.has( role.tier10.id)))
        {
            switch(args[0])
            {
                case 'Mei':
                    faction[user.id].faction = args[0];
                    break;
                case 'Kiana':
                    faction[user.id].faction = args[0];
                    break;
                case 'Bronya':
                    faction[user.id].faction = args[0];
                    break;
                case 'Himeko':
                    faction[user.id].faction = args[0];
                    break;   
                case 'Teri':
                    faction[user.id].faction = args[0];
                    break;
                case 'Fuhua':
                    faction[user.id].faction = args[0];
                    break;
                case 'Sakura':
                    faction[user.id].faction = args[0];
                    break;
                case 'Kallen':
                    faction[user.id].faction = args[0];
                    break;
                case 'Rita':
                    faction[user.id].faction = args[0];
                    break;
                case 'Seele':
                    faction[user.id].faction = args[0];
                    break;    
                case 'RozaLili':
                    faction[user.id].faction = args[0];
                    break;
                case 'Durandal':
                    faction[user.id].faction = args[0];
                    break;    
                default:
                    message.reply('please enter a valid faction');
                    return message.reply('valid factions: Mei, Bronya, Kiana, Himeko, Teri, Fuhua, Sakura, Kallen, Rita, Seele, RozaLili, Durandal');
    
            }
            money[user.id].money -= role.tier2.cost;
            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if(err) console.log('error', err);
            });

            fs.writeFile('./faction.json', JSON.stringify(faction), (err) => {
                if(err) console.log('error', err);
            });



            return message.reply('you have successfully joined ' + faction[user.id].faction + ' faction!');


        }
        else return message.reply('you need to be at least a' + role.tier2.name + 'and have at least ' + role.tier2.cost + currency + ' to join a faction');

        

	},
};