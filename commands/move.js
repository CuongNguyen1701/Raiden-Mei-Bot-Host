const Discord = require('discord.js');
const role = require('../roles.json');

const { prefix } = require('../config.json');
const mongoose = require('mongoose');

const bossAttack = require('../rpgfiles/boss');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');


module.exports = {
    name: 'move',
    description: 'di chuyển, 4 hướng đông tây nam bắc',
    cooldown: 15,
    execute(client, message, args) {
        //if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');

        let mapTiles = ':palm_tree:';
        let player = ':whale:';
        let size = 10;//map size
        let embed = new Discord.MessageEmbed();


        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

        //check if no first argument is provided(user mentioned) 

        let user = message.author;

        if (args[0] != 'north' && args[0] != 'south' && args[0] != 'west' && args[0] != 'east' &&
            args[0] != 'n' && args[0] != 's' && args[0] != 'w' && args[0] != 'e') {
            return message.reply('please provide a specific direction(north, south, west, east)')
        }
        let dir = args[0];

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: user.id
        }, (err, rpgData) => {
            if (err) console.log(err);
            if (!rpgData) {
               return message.reply('please declare your position using ' + prefix + 'position first!')
            }
            let data = rpgData;
            if(data.hp <= 0) return message.reply("you can't move" );

            
            switch (dir) {
                case 'north': case 'n':
                    if (data.posY == 1) return message.reply('you cannot move in that direction!');
                    data.posY--;
                    break;
                case 'south': case 's':
                    if (data.posY == 10) return message.reply('you cannot move in that direction!');
                    data.posY++;
                    break;
                case 'east': case 'e':
                    if (data.posX == 10) return message.reply('you cannot move in that direction!');
                    data.posX++;
                    break;
                case 'west': case 'w':
                    if (data.posX == 1) return message.reply('you cannot move in that direction!');
                    data.posX--;
                    break;
                }
                data.mp += 20;
                
                SaveData(data);
            let msg = client.users.cache.get(user.id).username + ' moved ' + dir;

            msg += '\n' + client.users.cache.get(user.id).username + "'s new position: " + data.posX + ',' + data.posY;
            for (var i = 1; i <= size; i++) {
                //on the correct row, draw player in the respective column 
                if (i == data.posY) msg += ('\n' + mapTiles.repeat(data.posX - 1) + player + mapTiles.repeat(size - data.posX));

                else msg += ('\n' + mapTiles.repeat(size));
            }
            message.channel.send(msg);
            bossAttack.execute(message);



        })

    },
};
