const Discord = require('discord.js');
const ms = require('parse-ms');
const { currency, prefix, mongoPass } = require('../config.json');
const role = require('../roles.json');
const color = require('../color.json');

const fs = require('fs');

const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');
const CoupData = require('../models/coupdata.js');


module.exports = {
    name: 'refreshcoup',
    description: 'thay đổi giá trị cổ phiếu, có thể sử dụng mỗi 1 tiếng 1 lần bởi những người có role cao',
    execute(client, message, args) {
        function SaveData(data) { data.save().catch(err => console.log(err)); }

        let roleMember = message.guild.member(message.author);
        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }//check tier
        if (!hasTier(role.tier5) && !hasTier(role.tier6) && !hasTier(role.tier7) && !hasTier(role.tier8) && !hasTier(role.tier9)  && !hasTier(role.tier10)  ) {
            return message.reply('you have to be at least a ' + role.tier5.name + ' to refresh coupon value!')
        }
        let timeout = 3600000;  //time until author can receive the money
        ;
        
        
        
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
                    if (!coupData) {
                        const newCoupData = new CoupData({
                            coupID: 'RaidenMei',
                            refreshTime: 0,
                            coupValue: 105,
                        })
                        SaveData(newCoupData);
                    }
                    else {
                        if (timeout - (Date.now() - coupData.refreshTime) > 0)//if last refresh cd has not been over
                      {
                            let time = ms(timeout - (Date.now() - coupData.refreshTime))
                
                            return message.reply('Coupon value has already been refreshed by someone, able to refresh in ' + time.minutes + 'm'
                                + time.seconds + 's')
                        }
                        coupData.refreshTime = Date.now();
                        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min;}


                        switch(coupData.coupValue >= 200 ? 1 : 
                            (coupData.coupValue < 200 && coupData.coupValue >= 100) ? 2 :
                            (coupData.coupValue < 100 && coupData.coupValue >=50) ? 3 : 0)
                        {
                            case 1: coupData.coupValue += RandInt(-20, 10); break;
                            case 2: coupData.coupValue += RandInt(-25, 25); break;
                            case 3: coupData.coupValue += RandInt(-10, 20); break;
                            case 0: coupData.coupValue = RandInt(25, 75); break;
                        }
                        SaveData(coupData);
                        message.channel.send('Coupon value refreshed! New value per Coupon: ' + coupData.coupValue + currency);
                        
                    }
                })
            }
        })
    }
}
