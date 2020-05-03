const Discord = require('discord.js');
const role = require('../roles.json');

const { mongoPass, currency, pCurrency, prefix } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');


module.exports = {
    name: 'position',
    description: 'vị trí hiện tại của bạn',
    aliases: ['pos', 'loc', 'location'],
    execute(client, message, args) {
        // if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');

        let mapTiles = ':palm_tree:';
        var player = ':whale:';
        let size = 10;//map size
        let embed = new Discord.MessageEmbed();


        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

        //check if no first argument is provided(user mentioned) 
        if (!args[0]) {
            var user = message.author;
        }
        else {
            switch (args[0]) {
                case 'boss':
                    var user = new Object();
                    user.id = 1;
                    player = ':japanese_ogre:'
                    break;
                case 'checkpoint': case 'cp':
                    var user = new Object();
                    user.id = 2;
                    player = ':fleur_de_lis:'
                    break;
                case 'treasure': case 'treas':
                    var user = new Object();
                    user.id = 3;
                    player = ':moneybag:'
                    break;
                default:
                    var user = message.mentions.users.first() || client.users.cache.get(args[0]);
                    break;
            }
        }
        if (!user) return message.reply('cannot find the user');


        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: user.id
        }, (err, rpgData) => {
            if (err) console.log(err);
            if (!rpgData) {
                message.reply('cannot find user')
            }
            data = rpgData;
            embed.setTitle(rpgData.name + "'s position: " + data.posX + ',' + data.posY);

            let msg = rpgData.name + "'s position: " + data.posX + ',' + data.posY;
            if (data.class == 'boss' && data.hp <= 0) msg += '\nthe boss is already dead!';
            for (var i = 1; i <= size; i++) {
                //on the correct row, draw player in the respective column 
                if (i == data.posY) msg += ('\n' + mapTiles.repeat(data.posX - 1) + player + mapTiles.repeat(size - data.posX));

                else msg += ('\n' + mapTiles.repeat(size));
            }
            message.channel.send(msg);



        })

    },
};