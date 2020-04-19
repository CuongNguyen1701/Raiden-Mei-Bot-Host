const fs = require('fs');
const money = require('../money.json');
const {currency} = require('../config.json');


module.exports = {
	name: 'adpay',
	description: 'tạo tiền từ không khí rồi trả',
	execute(client, message, args) {
        if(message.author.id != '609937407445434384') return message.reply('you cannot use this command!');
        let user = message.mentions.members.first() || client.users.cache.get(args[0])
        if(!user) return message.reply('sorry, could not find that user...');

        if(!args[1]) return message.reply('please specify the amount you want to pay.');




        else{
            if(!money[user.id])
            {
                money[user.id] = {
                    name: client.users.cache.get(user.id).tag,
                    money: parseInt(args[1]),
                };
    

    
                fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                    if(err) console.log('error', err);
                  });
            }
            else
            {
    
                money[user.id].money += parseInt(args[1]);
    
                fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                    if(err) console.log('error', err);
                  });
    
            }
            message.channel.send('The boss, ' + message.author.username + ' payed ' + args[1] + currency +  ' to ' + client.users.cache.get(user.id).username + '!');

        }




	},
};