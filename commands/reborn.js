const fs = require('fs');
const money = require('../money.json');
const {currency, pCurrency} = require('../config.json');
const role = require('../roles.json');


module.exports = {
	name: 'reborn',
	description: 'tái sinh bằng mazik, tiền về 100' + currency ,
	execute(client, message, args) {
        let roleMember = message.guild.member(message.author);

        function Reborn(rMoney)
        {
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
            catch{}

            money[message.author.id].money = rMoney;
            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if(err) console.log('error', err);
            });

            message.channel.send(client.users.cache.get(message.author.id).username + ' has been reborn with ' + money[message.author.id].money + currency + ' and ' + money[message.author.id].pMoney + pCurrency);
        }

        if(roleMember.roles.cache.has(role.tier10.id))
        {
            money[message.author.id].pMoney += 5000;
            Reborn(10000);
        }

        else if(money[message.author.id].money <= 100 && (roleMember.roles.cache.has(role.tier2.id) || roleMember.roles.cache.has(role.tier1.id))) 
        message.reply('khôn như đồng chí quê tôi xích đầy. Không làm mà đòi có ăn...');

        else if(roleMember.roles.cache.has(role.tier6.id) && money[message.author.id].money >= role.tier7.cost)
        {
            money[message.author.id].money = role.tier3.cost;
            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if(err) console.log('error', err);
            });
            
            roleMember.roles.add(role.tier7.id);
            roleMember.roles.remove(role.tier6.id);
            message.channel.send(client.users.cache.get(message.author.id).username + ' has been reborn with ' + money[message.author.id].money + currency + money[message.author.id].money + currency + ' and ' + money[message.author.id].pMoney + pCurrency + "... Wait, that's unusual...");


        }
        else
        {

            Reborn(100);
        }
        
	},
};