
const { currency, pCurrency, mongoPass } = require('../config.json');
const role = require('../roles.json');

const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( mongoPass, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

//MODELS
const Data = require('../models/data.js');

module.exports = {
    name: 'reborn',
    description: 'tái sinh bằng mazik, tiền về 100' + currency,
    execute(client, message, args) {
        let roleMember = message.guild.member(message.author);
        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }
        function SaveData(data) { data.save().catch(err => console.log(err)); }

        function Reborn(rMoney) {
            try//remove all role
            {
                roleMember.roles.remove(role.tier1.id);
                roleMember.roles.remove(role.tier2.id);
                roleMember.roles.remove(role.tier3.id);
                roleMember.roles.remove(role.tier4.id);
                roleMember.roles.remove(role.tier5.id);
                roleMember.roles.remove(role.tier6.id);
                roleMember.roles.remove(role.tier7.id);
                roleMember.roles.remove(role.tier8.id);
                roleMember.roles.remove(role.tier9.id);
                roleMember.roles.remove(role.tier10.id);
            }
            catch{ }

            data.money = rMoney;//reborn money
            SaveData(data);

            message.channel.send(client.users.cache.get(message.author.id).username + ' has been reborn with ' + data.money + currency + ' and ' + data.pMoney + pCurrency);
        }

        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            }
            else {
                switch ((hasTier(role.tier1) && data.money <= 100) ? 1
                    : (hasTier(role.tier6) && data.money >= role.tier7.cost) ? 6
                        : hasTier(role.tier10) ? 10 : 0) {

                    //prevent exploiting the reborn command        
                    case 1: message.reply('khôn như đồng chí quê tôi xích đầy. Không làm mà đòi có ăn...'); break;

                    case 6: 
                    data.money = role.tier3.cost;
                    SaveData(data);
                    roleMember.roles.add(role.tier7.id);
                    roleMember.roles.remove(role.tier6.id);
                    message.channel.send(client.users.cache.get(message.author.id).username + ' has been reborn with ' + data.money + currency +  ' and ' + data.pMoney + pCurrency + "... Wait, that's unusual...");
                    break;

                    case 10:
                        data.pMoney += 5000;//add premium currency 
                        Reborn(10000);
                        SaveData(data);
                        break;
                    case 0: Reborn(100); break;

                    
                }
                

            }
        })



    },
};