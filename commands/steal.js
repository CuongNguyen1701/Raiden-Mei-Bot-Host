const fs = require('fs');
const money = require('../money.json');
const { currency } = require('../config.json');
const Discord = require('discord.js');
const role = require('../roles.json');
const faction = require('../faction.json');





module.exports = {
    name: 'steal',
    description: 'cướp tiền, tỉ lệ 67%',
    execute(client, message, args) {
        let user = message.mentions.members.first() || client.users.cache.get(args[0]);
        var base = 1;
        let roleMember = message.guild.member(message.author);

        try {
            if (faction[message.author.id].faction == faction[user.id].faction) return message.reply('you cannot steal a person in your faction!');
        }
        catch
        { }

        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }

        switch (hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
            hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
                hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
                    hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
                        hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0) {
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




        let embed = new Discord.MessageEmbed;
        let steal = 500 * base;

        //if user has a money account
        if (!money[user.id]) return message.reply('sorry that person have no money, they are too poor.');

        //if author doesnt provide any number of currency to steal
        if (!args[1] || !parseInt(args[1])) {
            if (money[user.id].money > steal) args[1] = Math.floor(Math.random() * steal + 1);

            else args[1] = Math.floor(Math.random() * money[user.id].money) + 1;
        }


        if (!user) return message.reply('sorry, could not find that user...');


        //if tagged person is Mei
        if (money[user.id].name == "Raiden Mei 2.0#4150") {
            if (!money[message.author.id]) {
                money[message.author.id] = {
                    name: client.users.cache.get(message.author.id).tag,
                    money: - 500 * base
                };
            }
            else money[message.author.id].money -= 10 * steal;

            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if (err) console.log('error', err);
            });
            return message.reply("You cannot steal from Mei! Here's a fine of " + 10 * steal + currency + "!");
        }

        //if provided number(arg[1]) larger than max steal
        if (parseInt(args[1]) > steal) return message.reply("stop being greedy! you can only steal up to " + steal + currency + "!");

        //if steal number is more than the user's balance
        if (parseInt(args[1]) > money[user.id].money) return message.reply('they do not have that much money!');

        //obvious
        if (parseInt(args[1]) < 1) return message.reply("you cannot steal less than 1" + currency + ", that's meaningless!");


        //check if the author has no account or negative balance 
        if (!money[message.author.id] || money[message.author.id].money < 0) return message.reply('you are too poor to steal!');




        let chances = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var pick = chances[Math.floor(Math.random() * chances.length)];


        if (pick >= 4) {

            money[user.id].money -= parseInt(args[1]);

            money[message.author.id].money += parseInt(args[1]);

            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if (err) console.log('error', err);
            });


            embed.setTitle(message.author.username + ' successfully stealed ' + parseInt(args[1]) + currency + ' from '
                + client.users.cache.get(user.id).username + '. ' + message.author.username + "'s new balance: " + money[message.author.id].money + currency);

            embed.setDescription(client.users.cache.get(user.id).username + ' lost their money. ' + client.users.cache.get(user.id).username
                + "'s new balance: " + money[user.id].money + currency);

            embed.setFooter('');
            message.channel.send(embed);

        }
        else {



            money[message.author.id].money -= 3 * parseInt(args[1]);

            money[user.id].money += parseInt(args[1] * 1.5);


            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if (err) console.log('error', err);
            });


            embed.setTitle(message.author.username + ' failed and received a fine of ' + 3 * parseInt(args[1]) + currency + '. '
                + message.author.username + "'s new balance: " + money[message.author.id].money + currency);

            embed.setDescription(client.users.cache.get(user.id).username + ' was compensated ' + parseInt(args[1] * 1.5) + currency + '. '
                + client.users.cache.get(user.id).username + "'s new balance: " + money[user.id].money + currency);
            embed.setFooter('');
            message.channel.send(embed);

        }







    },
};