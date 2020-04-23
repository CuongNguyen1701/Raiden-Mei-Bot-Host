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
    name: 'sellcoup',
    description: 'bán cổ phiếu, giá trị cổ phiểu thay đổi mỗi 1 tiếng',
    execute(client, message, args) {

        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed();


        function SaveData(d) { d.save().catch(err => console.log(err)); }

        
        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            }
            else {

                CoupData.findOne({//find the coup folder
                    coupID: 'RaidenMei',
                }, (err, coupData) => {
                    if (err) console.log(err);
                    if (!coupData) {//in case of data being lost or corrupted
                        const newCoupData = new CoupData({
                            coupID: 'RaidenMei',
                            refreshTime: 0,
                            coupValue: 105,
                        })
                        SaveData(newCoupData);
                    }
                    else {
                        if(args[0] == 'all' || args[0] == 'max') args[0] = data.coup;
                        else if (isNaN(args[0]) || !args[0]) {//avoid errors
                           return message.reply('please specify the number of coupons you wanna sell. Current value per coupon: ' + coupData.coupValue + currency)
                        }
                
                        let sellNumber = parseInt(args[0]);
                        if(sellNumber > data.coup || !data.coup) return message.reply("you don't have enough coupons!");
                        if (sellNumber <= 0) return message.reply('please use a positive number!');//prevent buying coupon using this command
        
        
                        data.money += coupData.coupValue * sellNumber;
                        data.coup -= sellNumber;

                        SaveData(data);

                        embed.setTitle('you sold ' + sellNumber + ' coupons!');
                        embed.setDescription('current coupons: ' + data.coup);
                        embed.addField('current balance: ' + data.money + currency);
                        message.channel.send(embed);

                    }
                })

            }
        })
    }
}