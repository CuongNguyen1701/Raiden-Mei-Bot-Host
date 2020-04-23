
const { currency, mongoPass } = require('../config.json');
const role = require('../roles.json');


const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

//MODELS
const Data = require('../models/data.js');

module.exports = {
    name: 'pay',
    description: 'trả tiền',
    cooldown: 1800,
    execute(client, message, args) {
        let user = message.mentions.members.first() || client.users.cache.get(args[0]);
        let roleMember = message.guild.member(message.author);

        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }
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

                    if (!user) return message.reply('sorry, could not find that user...');
                    switch (hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
                        hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
                            hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
                                hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
                                    hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0) {
                        case 1: base = 15; break;
                        case 2: base = 20; break;
                        case 3: base = 25; break;
                        case 4: base = 30; break;
                        case 5: base = 40; break;
                        case 6: base = 50; break;
                        case 7: base = 100; break;
                        case 8: base = 200; break;
                        case 9: base = 500; break;
                        case 10: base = 700; break;
                        case 0: base = 1; break;
                    }
                    let maxPay = 100 * base;


                    if (user.id === message.author.id) //if the author pay himself
                    {
                        if (roleMember.roles.cache.has(role.tier3.id) && authorData.money >= role.tier4.cost)//if has role tier 3, trigger promote
                        {
                            authorData.money -= role.tier4.cost;

                            roleMember.roles.remove(role.tier3.id);
                            roleMember.roles.add(role.tier4.id);


                            return message.reply('you cannot pay yourse... Ohhhh!');
                        }
                        else return message.reply('you cannot pay yourself, get a friend or something!');
                    }
                    if (!args[1] || isNaN(args[1])) return message.reply('please specify the amount you want to pay.');//no provided number


                    if (parseInt(args[1]) > authorData.money) return message.reply('you do not have that much money, stop daydreaming!'); //if author try to pay more than he has

                    if (parseInt(args[1]) < 1) return message.reply('you cannot pay less than 1' + currency + ', you greedy little potato!');

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
                        authorData.money -= parseInt(args[1]); //money take
                        SaveData(authorData);
                        
                    }
                    else {
                        userData.money += parseInt(args[1]);//add money
                        authorData.money -= parseInt(args[1]);//take money
                        SaveData(userData);
                        SaveData(authorData);
                        
                    }
                    return message.channel.send(message.author.username + ' paid ' + args[1] + currency + ' to ' + client.users.cache.get(user.id).username);
                })


            }
        })

    },
};