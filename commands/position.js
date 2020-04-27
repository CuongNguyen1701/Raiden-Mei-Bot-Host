const Discord = require('discord.js');
const role = require('../roles.json');

const { mongoPass, currency, pCurrency, prefix } = require('../config.json');
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
       // if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');

        let mapTiles = ':palm_tree:';
        let player = ':whale:';
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
                 message.reply('please use ' + prefix + 'char command first!' ) 
            }
            data = rpgData;
            embed.setTitle(client.users.cache.get(user.id).username + "'s position: " + data.posX + ',' + data.posY);

            let msg = client.users.cache.get(user.id).username + "'s position: " + data.posX + ',' + data.posY;
            for(var i = 1; i <= size; i++)
            {
                //on the correct row, draw player in the respective column 
                if(i == data.posY) msg += ('\n' + mapTiles.repeat(data.posX -1) + player + mapTiles.repeat(size - data.posX));

                else msg +=  ( '\n' + mapTiles.repeat(size));
            }
            message.channel.send(msg);



        })

    },
};