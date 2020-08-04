const mongoose = require('mongoose');
const Discord = require('discord.js');
const color = require('../color.json');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/luckynumdata.js');

module.exports = {
    name: 'restart',
    description: 'xóa toàn bộ dữ liệu lucky number',
    execute(client, message, args) {
        if (message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');



        Data.remove({})
        message.channel.send(`datas have been deleted`);


    },
};