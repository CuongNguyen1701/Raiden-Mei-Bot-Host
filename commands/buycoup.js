const Discord = require('discord.js');
const { currency, prefix, mongoPass } = require('../config.json');
const role = require('../roles.json');
const color = require('../color.json');

const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');
const CoupData = require('../models/coupdata.js');

module.exports = {
    name: 'buycoup',
    description: 'mua cổ phiếu, giá trị cổ phiểu thay đổi mỗi 1 tiếng',
    execute(client, message, args) {
        
        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed();

        let maxCoup = 100;//max coup user can own

        function hasTier(tier) { return roleMember.roles.cache.has(tier.id); }
        function SaveData(d) { d.save().catch(err => console.log(err)); }
        
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



        
        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            }
            else {

                CoupData.findOne({
                    coupID: 'RaidenMei',
                }, (err, coupData) => {
                    if (err) console.log(err);
                    if (!coupData)
                    {const newCoupData = new CoupData({
                        coupID: 'RaidenMei',
                        refreshTime: 0,
                        coupValue: 105,
                    })
                    SaveData(newCoupData);
                    }
                    else
                    {
                        if (!data.coup) data.coup = 0;
                        let availCoup = maxCoup - data.coup;//maximum number of coupons the user can buy
        
                        if(args[0] == 'max' || args[0] == 'all'){
                            args[0] = Math.floor(data.money/coupData.coupValue);//max possible value w/o restriction
                            if(args[0] > availCoup) args[0] = availCoup;//reduce the value
                        } 
                        else if (isNaN(args[0]) || !args[0]) {//avoid errors
                           return message.reply('please specify the number of coupons you wanna buy. Current value per coupon: ' + coupData.coupValue + currency)
                        }
                
                        let buyNumber = parseInt(args[0]);
                
                        if (buyNumber <= 0) return message.reply('please use a positive number!');//prevent selling coupon using this command
                        
                        if(data.coup >= maxCoup) return message.reply('you can only own up to ' + maxCoup + 'coupons!');
                        if((data.coup + buyNumber) > maxCoup) return message.reply('you can only buy ' +  availCoup + ' more coupons!')
                        if (data.money < coupData.coupValue * buyNumber) return message.reply("you don't have enough money");
        
                        data.money -= coupData.coupValue * buyNumber;
                        data.coup += buyNumber;

                        SaveData(data);

                        embed.setTitle('you bought ' + buyNumber + ' coupons!');
                        embed.setDescription('current coupons: ' + data.coup);
                        embed.addField('current balance: ' + data.money + currency);
                        message.channel.send(embed);

                    }
                })

            }
        })
    }
}
