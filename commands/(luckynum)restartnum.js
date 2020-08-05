const mongoose = require('mongoose');
const Discord = require('discord.js');
const color = require('../color.json');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/luckynumdata.js');

module.exports = {
    name: 'restartnum',
    description: 'reset lucky num',
    execute(client, message, args) {

        if (message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');

        Data.deleteMany({ 'checkable': true }).catch(err => console.log(err));

        message.channel.send('datas have been deleted');








    },
};