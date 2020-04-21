const Discord = require('discord.js');
const ms = require('parse-ms');
const { currency, prefix, mongoPass } = require('../config.json');
const role = require('../roles.json');
const color = require('../color.json');
const { coupData } = require('../coup.json');


const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');

module.exports = {
    name: 'buycoup',
    description: 'mua cổ phiếu, giá trị cổ phiểu thay đổi mỗi 1 tiếng',
    execute(client, message, args) {

        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed();

        let maxCoup = 100;

        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }

        switch (hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
            hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
                hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
                    hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
                        hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0) {
            case 1: maxCoup = 10; break;
            case 2: maxCoup = 70; break;
            case 3: maxCoup = 100; break;
            case 4: maxCoup = 200; break;
            case 5: maxCoup = 300; break;
            case 6: maxCoup = 500; break;
            case 7: maxCoup = 700; break;
            case 8: maxCoup = 800; break;
            case 9: maxCoup = 900; break;
            case 10: maxCoup = 1000; break;
            case 0: maxCoup = 2; break;
        }

        function SaveData(data) { data.save().catch(err => console.log(err)); }


        if (isNaN(args[0]) || !args[0]) {//avoid errors
            message.reply('please specify the amount of coupon you wanna buy. Current value per coupon: ' + coupData.coupValue + currency)
        }

        buyAmount = parseInt(args[0]);

        if (buyAmount <= 0) return message.reply('please use a positive number!');//prevent selling coupon using this command

        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            }
            else {
                if (!data.coup) data.coup = 0;
                if(data.coup >= maxCoup) return message.reply('you can only own up to ' + maxCoup + 'coupons!');
                let availCoup = maxCoup - data.coup;//maximum number of coupons the user can buy
                if((data.coup + buyAmount) > maxCoup) return message.reply('you can only buy ' +  availCoup + ' more coupons!')
                if (data.money < coupData.coupValue * buyAmount) return message.reply("you don't have enough money");

                data.money -= coupData.coupValue * buyAmount;
                data.coup += buyAmount;
                SaveData(data);
                embed.setTitle('you bought ' + buyAmount + ' coupons!');
                embed.setDescription('current coupons: ' + data.coup);
                embed.addField('current balance: ' + data.money + currency);
                message.channel.send(embed);

            }
        })
    }
}