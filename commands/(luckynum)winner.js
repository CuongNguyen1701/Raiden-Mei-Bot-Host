
const role = require('../roles.json');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const color = require('../color.json');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/luckynumdata.js');

module.exports = {
    name: 'winner',
    description: 'tìm người thắng cuộc',
    execute(client, message, args) {

        let embed = new Discord.MessageEmbed();

        if (!args[0] || !Number.isInteger(Number(args[0]))) {
            return message.reply(`please enter a whole number`)
        } else {

            Data.findOne({
                guess: args[0]
            }, (err, data) => {
                if (err) console.log(err);
                if (data) {
                    embed.setTitle(`CONGRATULATION! ${data.name} WIN!`)
                    embed.setColor(color.green);
                    embed.setDescription(`guessed number: ${data.guess}`)
                }
                else {
                    message.channel.send(`there's no winner!`)
                }
            })

        }




    },
};