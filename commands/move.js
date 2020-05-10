const Discord = require('discord.js');
const role = require('../roles.json');

const { prefix } = require('../config.json');
const mongoose = require('mongoose');

const bossAttack = require('../rpgfiles/bossAttack');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');


module.exports = {
    name: 'move',
    description: 'di chuyển, 4 hướng đông tây nam bắc',
    cooldown: 5,
    execute(client, message, args) {
        //if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');

        let mapTiles = ':palm_tree:';
        let player = ':whale:';
        let size = 10;//map size
        let embed = new Discord.MessageEmbed();


        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

        //check if no first argument is provided(user mentioned) 

        let user = message.author;

        var viableArgs = ['north', 'n', 'south', 's', 'west', 'w', 'east', 'e', 'up', 'down', 'left', 'right', 'u', 'd', 'l', 'r'];

        if (!viableArgs.includes(args[0])) {
            return message.reply('please provide a specific direction(north, south, west, east)')
        }
        var dir;
        switch (args[0]) {
            case 'n': case 'up': case 'u':
                dir = 'north';
                break;
            case 's': case 'down': case 'd':
                dir = 'south';
                break;
            case 'w': case 'left': case 'l':
                dir = 'west';
                break;
            case 'e': case 'right': case 'r':
                dir = 'east';
                break;
            default:
                dir = args[0];
                break;


        }

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: user.id
        }, (err, rpgData) => {
            if (err) console.log(err);
            if (!rpgData) {
                return message.reply('please declare your position using ' + prefix + 'position first!')
            }
            let data = rpgData;
            if (data.hp <= 0) return message.reply("you can't move");


            switch (dir) {
                case 'north':
                    if (data.posY == 1) return message.reply('you cannot move in that direction!');
                    data.posY--;
                    break;
                case 'south':
                    if (data.posY == 10) return message.reply('you cannot move in that direction!');
                    data.posY++;
                    break;
                case 'east':
                    if (data.posX == 10) return message.reply('you cannot move in that direction!');
                    data.posX++;
                    break;
                case 'west':
                    if (data.posX == 1) return message.reply('you cannot move in that direction!');
                    data.posX--;
                    break;
            }
            data.mp += 20;
            if (data.mp > data.maxMp) data.mp = data.maxMp;

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
