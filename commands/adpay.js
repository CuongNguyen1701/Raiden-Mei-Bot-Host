
const {currency, mongoPass} = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

//MODELS
const Data = require('../models/data.js');


module.exports = {
	name: 'adpay',
	description: 'tạo tiền từ không khí rồi trả',
	execute(client, message, args) {
        if(message.author.id != '609937407445434384') return message.reply('you cannot use this command!');
        let user = message.mentions.members.first() || client.users.cache.get(args[0]);

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        Data.findOne({
            userID: message.author.id//find author id in database
        }, (err, authorData) => {
            if (err) console.log(err);
            if (!authorData) { //check if author has no data on database
                return message.reply('please use ' + prefix + 'create first');
            }
            else {
                Data.findOne({
                    userID: user.id//find user id in database
                }, (err, userData) => {
                    if (err) console.log(err);

                    let base = 1000000;
                    let maxPay = 100 * base;



                    if (!args[1] || isNaN(args[1])) return message.reply('please specify the amount you want to pay.');//no provided number


                    if (parseInt(args[1]) > maxPay) return message.reply('you cannot pay more than ' + maxPay + currency);

                    if (!userData) { //check if user has no data on database
                        const newData = new Data({
                            name: client.users.cache.get(user.id).username,
                            userID: user.id,
                            lb: 'all',
                            money: parseInt(args[1]),//money paid
                            pMoney: 0,
                            faction: null,
                            daily: Date.now(),
                            investMoney: null,
                            investTime: null,
                            investCD: false,
                            investStonks: true,

                        })
                        SaveData(newData);

                        
                    }
                    else {
                        userData.money += parseInt(args[1]);//add money

                        SaveData(userData);
                        
                    }
                    return message.channel.send(message.author.username + ' paid ' + args[1] + currency + ' to ' + client.users.cache.get(user.id).username);
                })


              
            }
        })


	},
};