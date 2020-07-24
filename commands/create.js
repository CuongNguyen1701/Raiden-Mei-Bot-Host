const { mongoPass } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');

module.exports = {
    name: 'create',
    description: 'tạo thông tin trên database',
    execute(client, message, args) {
        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                const newData = new Data({
                    name: client.users.cache.get(message.author.id).username,
                    userID: message.author.id,
                    lb: 'all',
                    money: 0,
                    pMoney: 0,
                    faction: null,
                    daily: null,
                    investMoney: null,
                    investCD: false,
                    investStonks: true,
                    coup: 0,

                })
                newData.save().catch(err => console.log(err));
                return message.reply('data created successfully!');
            } else {
                return message.reply('you have already create your data');
            }
        })
    },

};