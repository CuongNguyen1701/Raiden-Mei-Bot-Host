const Discord = require('discord.js');
const mongoose = require('mongoose');
const config = require('../config.json');

//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');


module.exports = {
    name: 'leaderboard',
    description: 'xem BXH',
    aliases:['lb', 'top'],
    execute(client, message, args) {
        Data.find({
            lb: 'all',
        }).sort([
            ['pMoney', 'descending']
        ]).exec((err, res) => {
            if(err) console.log(err);

            var page = Math.ceil(res.length / 10 )

            let embed = new Discord.MessageEmbed();
            embed.setTitle('LEADERBOARD');
            embed.setThumbnail('https://i.kym-cdn.com/photos/images/newsfeed/001/499/826/2f0.png');
            let pg = parseInt(args[0])
            if(pg != Math.floor(pg) || !pg) pg = 1;
            let end = pg*10;
            let start = (pg * 10) - 10
            if(res.length === 0 || res.length <= start){
                embed.addField('Error', "No pages found")
            } else if (res.length <= end){
                embed.setFooter('page ' + pg + ' of ' + page);
                for(i = start; i < res.length; i++)
                {
                    embed.addField((i + 1) + '. ' + res[i].name, res[i].pMoney.toLocaleString() + res.pCurrency)
                }
            }
            else{
                embed.setFooter('page ' + pg + ' of ' + page);
                for(i = start; i < end; i++)
                {
                    embed.addField((i + 1) + '. ' + res[i].name, res[i].pMoney.toLocaleString() + res.pCurrency)
                }
            }
            message.channel.send(embed);

        });

    }

}