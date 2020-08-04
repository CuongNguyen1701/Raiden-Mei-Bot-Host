
const { mongoPass } = require('../config.json');
const role = require('../roles.json');
const mongoose = require('mongoose');

//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/luckynumdata.js');

module.exports = {
    name: 'guess',
    description: 'đoán lucky number',
    execute(client, message, args) {
        function SaveData(data) { data.save().catch(err => console.log(err)); }
        var user = message.author;
        let min = 1;
        let max = 57;
        if (!args[0] || !Number.isInteger(Number(args[0])) || args[0] < min || args[0] > max) {
            return message.reply(`please enter a whole number between ${min} and ${max}`)
        } else {
            Data.findOne({
                userID: user.id
            }, (err, data) => {
                if (err) console.log(err);
                // if (!data) {
                Data.findOne({
                    guess: args[0]
                }, (err, guessdata) => {
                    if (err) console.log(err);
                    if (!guessdata) {
                        var newData = new Data({
                            name: client.users.cache.get(user.id).username,
                            userID: user.id,
                            guess: args[0],
                            checkable: true
                        })
                        SaveData(newData);
                        return message.reply(`you guessed ${args[0]}!`);
                    }
                    else {
                        return message.reply(`${args[0]} is already guessed by someone!`);
                    }
                })
                // }
                // else {
                // return message.reply(`you have already guessed ${data.guess}!`);
                // }
            })

        }




    },
};