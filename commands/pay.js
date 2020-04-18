const fs = require('fs');
const money = require('../money.json');
const {currency} = require('../config.json');
const role = require('../roles.json');



module.exports = {
	name: 'pay',
	description: 'trả tiền',
	execute(client, message, args) {
        let user = message.mentions.members.first() || client.users.cache.get(args[0]);
        let roleMember = message.guild.member(message.author);

        function hasTier(tier) {return roleMember.roles.cache.has(tier.id)}
   
        switch(hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
                hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
                hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
                hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
                hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0)
                {
                    case 1: base = 1.5; break;
                    case 2: base = 2; break;
                    case 3: base = 2.5; break;
                    case 4: base = 3; break;
                    case 5: base = 4; break;
                    case 6: base = 5; break;
                    case 7: base = 10; break;
                    case 8: base = 20; break;
                    case 9: base = 50; break;
                    case 10: base = 70; break;
                    case 0: base = 1; break;
                }
            let maxPay = 100*base;

        if(!user) return message.reply('sorry, could not find that user...');

        if(!args[1] || isNaN(args[1])) return message.reply('please specify the amount you want to pay.');

        if(!money[message.author.id]) return message.reply('sorry you have no money, you are poor.' );

        if(parseInt(args[1]) > money[message.author.id].money) return message.reply('you do not have that much money, stop daydreaming!' );

        if(parseInt(args[1]) < 1) return message.reply('you cannot pay less than 1' + currency +  ', you greedy little potato!' );

        if(parseInt(args[1]) > maxPay) return message.reply('you cannot pay more than ' + maxPay + currency)

        if(user.id === message.author.id) 
        {
            if(roleMember.roles.cache.has(role.tier3.id) && money[message.author.id].money >= role.tier4.cost)
            {
                money[message.author.id].money -= role.tier4.cost;

                roleMember.roles.remove(role.tier3.id);
                roleMember.roles.add(role.tier4.id);
                fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                    if(err) console.log('error', err);
                });
                return message.reply('you cannot pay yourse... Ohhhh!');
            }
            else return message.reply('you cannot pay yourself, get a friend or something!');
        }
        
            if(!money[user.id])
            {
                money[user.id] = {
                    name: client.users.cache.get(user.id).tag,
                    money: parseInt(args[1])
                };
    
                money[message.author.id].money -= parseInt(args[1]);
    
                fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                    if(err) console.log('error', err);
                  });
            }
            else
            {
                money[message.author.id].money -= parseInt(args[1]);
    
                money[user.id].money += parseInt(args[1]);
    
                fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                    if(err) console.log('error', err);
                  });
    
            }
            message.channel.send(message.author.username + ' paid ' + args[1] + currency +  ' to ' + client.users.cache.get(user.id).username );

        




	},
};