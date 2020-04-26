const Discord = require('discord.js');
const role = require('../roles.json');

const { prefix } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');


module.exports = {
    name: 'move',
    description: 'di chuyển, 4 hướng đông tây nam bắc',
    execute(client, message, args) {
        //if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');

        let mapTiles = ':palm_tree:';
        let player = ':whale:';
        let size = 10;//map size
        let embed = new Discord.MessageEmbed();


        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

        //check if no first argument is provided(user mentioned) 
        let user = message.author;

        if (args[0] != 'north' && args[0] != 'south' && args[0] != 'west' && args[0] != 'east') {
            return message.reply('please provide a specific direction(north, south, west, east)')
        }
        let dir = args[0];

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: user.id
        }, (err, rpgData) => {
            if (err) console.log(err);
            if (!rpgData) {
                message.reply('please declare your position using ' + prefix + 'position first!')
            }
            data = rpgData;
            switch (dir) {
                case 'north':
                    if (data.posY == 0) return message.reply('you cannot move in that direction!');
                    data.posY--;
                    SaveData(data);
                    break;
                case 'south':
                    if (data.posY == 10) return message.reply('you cannot move in that direction!');
                    data.posY++;
                    SaveData(data);
                    break;
                case 'east':
                    if (data.posX == 10) return message.reply('you cannot move in that direction!');
                    data.posX++;
                    SaveData(data);
                    break;
                case 'west':
                    if (data.posX == 0) return message.reply('you cannot move in that direction!');
                    data.posX--;
                    SaveData(data);
                    break;
            }

            let msg = client.users.cache.get(user.id).username + 'moved ' + dir;

            msg += '\n' + client.users.cache.get(user.id).username + "'s position: " + data.posX + ',' + data.posY;
            for (var i = 1; i <= size; i++) {
                //on the correct row, draw player in the respective column 
                if (i == data.posY) msg += ('\n' + mapTiles.repeat(data.posX - 1) + player + mapTiles.repeat(size - data.posX));

                else msg += ('\n' + mapTiles.repeat(size));
            }
            message.channel.send(msg);



        })

    },
};