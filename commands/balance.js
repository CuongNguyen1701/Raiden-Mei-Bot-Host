const fs = require('fs');
const money = require('../money.json');
const {currency, pCurrency} = require('../config.json');

module.exports = {
	name: 'balance',
	description: 'tài khoản',
	execute(client, message, args) {

        if(!args[0]){
            var user = message.author;
        }else{
            var user = message.mentions.users.first() || client.users.cache.get(args[0]); 
        }
        if(!money[user.id]){
            money[user.id] = {
                name: client.users.cache.get(user.id).tag,
                money: 0,
                pMoney: 0
            }
            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if(err) console.log('error', err);
            });
        }
        message.channel.send(client.users.cache.get(user.id).username + ' has ' + money[user.id].money + currency + ' and ' + money[user.id].pMoney + pCurrency);
	},
};