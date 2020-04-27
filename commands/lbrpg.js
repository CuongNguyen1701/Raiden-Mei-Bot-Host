const Discord = require('discord.js');
const mongoose = require('mongoose');
const config = require('../config.json');

//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const RpgData = require('../models/rpgdata.js');


module.exports = {
    name: 'lbrpg',
    description: 'xem BXH RPG' + config.currency,

    execute(client, message, args) {
        if (args[0] == 'atk' || args[0] == 'def' || args[0] == 'level') {
            stat = args[0];
        }
        else {
            return message.reply('please specify the rpg stat(excluding HP and MP)')
        }

        RpgData.find({
            lb: 'all',
        }).sort([
            [stat, 'descending']
        ]).exec((err, res) => {
            if (err) console.log(err);

            var page = Math.ceil(res.length / 10)

            let embed = new Discord.MessageEmbed();
            embed.setTitle('LEADERBOARD' + stat.toUpperCase());
            embed.setThumbnail('https://wompampsupport.azureedge.net/fetchimage?siteId=7575&v=2&jpgQuality=100&width=700&url=https%3A%2F%2Fi.kym-cdn.com%2Fentries%2Ficons%2Ffacebook%2F000%2F033%2F303%2Fpanki.jpg');
            let pg = parseInt(args[0])
            if (pg != Math.floor(pg) || !pg) pg = 1;
            let end = pg * 10;
            let start = (pg * 10) - 10
            if (res.length === 0 || res.length <= start) {
                embed.addField('Error', "No pages found")
            } else if (res.length <= end) {
                embed.setFooter('page ' + pg + ' of ' + page);
                for (i = start; i < res.length; i++) {
                    switch (stat) {
                        case 'atk':
                            embed.addField((i + 1) + '. ' + res[i].name, res[i].atk.toLocaleString())
                            break;
                        case 'def':
                            embed.addField((i + 1) + '. ' + res[i].name, res[i].def.toLocaleString())
                            break;
                        case 'level':
                            embed.addField((i + 1) + '. ' + res[i].name, res[i].level.toLocaleString())
                            break;

                    }
                }
            }
            else {
                embed.setFooter('page ' + pg + ' of ' + page);
                for (i = start; i < end; i++) {
                    switch (stat) {
                        case 'atk':
                            embed.addField((i + 1) + '. ' + res[i].name, res[i].atk.toLocaleString())
                            break;
                        case 'def':
                            embed.addField((i + 1) + '. ' + res[i].name, res[i].def.toLocaleString())
                            break;
                        case 'level':
                            embed.addField((i + 1) + '. ' + res[i].name, res[i].level.toLocaleString())
                            break;

                    }
                }
            }
            message.channel.send(embed);

        });

    }

}