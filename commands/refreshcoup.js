const Discord = require('discord.js');
const ms = require('parse-ms');
const { currency, prefix, mongoPass } = require('../config.json');
const role = require('../roles.json');
const color = require('../color.json');
const {coupData} = require('../coup.json');

const fs = require('fs');

const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');

module.exports = {
    name: 'refreshcoup',
    description: 'thay đổi giá trị cổ phiếu, có thể sử dụng mỗi 1 tiếng 1 lần bởi những người có role cao',
    execute(client, message, args) {
        function Write()//write local database
        {
            fs.writeFile('./coup.json', JSON.stringify(coupData), (err) => {
                if(err) console.log('error', err);
            });
        }
        let roleMember = message.guild.member(message.author);
        function hasTier(tier) {return roleMember.roles.cache.has(tier.id)}//check tier
        if(hasTier(role.tier1) || hasTier(role.tier2) || hasTier(role.tier3) || hasTier(role.tier4))
        {
           return message.reply('you have to be at least a ' + role.tier5.name + ' to refresh coupon value!')
        }
        let timeout = 3600000;  //time until author can receive the money
;
        if(timeout - (Date.now() - coupData.refreshTime) > 0)//if last refresh cd has not been over
        {
            let time = ms(timeout - (Date.now() - coupData.refreshTime))

            return message.reply('Coupon value has already been refreshed by someone, able to refresh in ' + time.minutes + 'm'
             + time.seconds + 's')
        }
        
    

        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            }
            else {
                coupData.refreshTime = Date.now();
                coupData.coupValue = Math.floor(Math.random() * 190) + 10 //random from 10-200
                Write();
                message.channel.send('Coupon value refreshed! New value per Coupon: ' + coupData.coupValue + currency);
            }
        })
    }
}
