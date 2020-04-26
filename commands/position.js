const Discord = require('discord.js');
const role = require('../roles.json');

const { mongoPass, currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));
//MODELS
const RpgData = require('../models/rpgdata.js');


module.exports = {
    name: 'position',
    description: 'vị trí hiện tại của bạn',
    execute(client, message, args) {
        if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');

        let mapTiles = '[ ]';
        let player = '[*]';
        let size = 10;//map size
        let embed = new Discord.MessageEmbed();

      
        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min;}
      
        //check if no first argument is provided(user mentioned) 
        if(!args[0]){
            var user = message.author;
        }else{
            var user = message.mentions.users.first() || client.users.cache.get(args[0]); 
        }
        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: user.id
        }, (err, rpgData)=>{
            if(err) console.log(err);
            if (!rpgData)
            {
                 var newData = new RpgData({
                    name: client.users.cache.get(user.id).username,
                    userID: user.id,
                    posX: RandInt(1,10),
                    posY: RandInt(1,10),
                 })
                 SaveData(newData); 
            }
            data = newData || rpgData;
            embed.setTitle(client.users.cache.get(user.id).username + "'s position: " + data.posX + ',' + data.posY);
            for(var i = 1; i <= size; i++)
            {
                if(i == data.posY) embed.addField(' ' , mapTiles.repeat(data.posX -1) + player + mapTiles.repeat(size - data.posX));
                else embed.addField(' ', mapTiles.repeat(size));
            }
            message.channel.send(embed);



        })

    },
};