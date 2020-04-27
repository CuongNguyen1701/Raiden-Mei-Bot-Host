
const { currency, pCurrency, mongoPass } = require('../config.json');
const role = require('../roles.json');

const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

//MODELS
const Data = require('../models/data.js');

module.exports = {
    name: 'reborn',
    description: 'tái sinh bằng mazik, tiền về 100' + currency,
    cooldown: 7200,
    execute(client, message, args) {
        let roleMember = message.guild.member(message.author);
        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }
        function SaveData(data) { data.save().catch(err => console.log(err)); }

        function Reborn(rMoney, data) {
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
            data.coup = 0;
            data.faction = null;
            data.investMoney = null;
            data.investCD = false;
            data.investStonks = true;
            SaveData(data);

        }
        
        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            }
            else {

                if(!hasTier(role.tier1) && !hasTier(role.tier2) && !hasTier(role.tier3)&& !hasTier(role.tier4)
                && !hasTier(role.tier5)&& !hasTier(role.tier6)&& !hasTier(role.tier7)&& !hasTier(role.tier8)
                && !hasTier(role.tier9)&& !hasTier(role.tier10))
                {
                    return message.reply('Golden Experience Requiem just said NO');
                }

                switch ((hasTier(role.tier1) && data.money <= 100) ? 1
                : (hasTier(role.tier6) && data.money >= role.tier7.cost) ? 6
                : hasTier(role.tier10) ? 10 : 0) {
                    
                    //prevent exploiting the reborn command        
                    case 1: message.reply('khôn như đồng chí quê tôi xích đầy. Không làm mà đòi có ăn...'); break;
                    
                    case 6: 
                    Reborn(role.tier3.cost, data);
                    SaveData(data);
                    roleMember.roles.add(role.tier7.id);
                    roleMember.roles.remove(role.tier6.id);
                    message.channel.send(client.users.cache.get(message.author.id).username + ' has been reborn with ' + data.money + currency +  ' and ' + data.pMoney + pCurrency + "... Wait, that's unusual...");
                    break;
                    
                    case 10:
                        if(data.money > 2.5 * role.tier10.cost) data.money = 2.5 * role.tier10.cost;//cap the covertable money
                        
                        data.pMoney += 2500;//add premium money
                        data.pMoney += Math.floor(data.money / 1000); //increase premium money base on the current money
                        
                        Reborn(10000, data);
                        SaveData(data);
                        message.channel.send(client.users.cache.get(message.author.id).username + ' has been reborn with ' + data.money + currency + ' and ' + data.pMoney + pCurrency);
                        break;

                    case 0: 
                    Reborn(100, data);
                    message.channel.send(client.users.cache.get(message.author.id).username + ' has been reborn with ' + data.money + currency + ' and ' + data.pMoney + pCurrency);
                    break;

                    
                }
                

            }
        })



    },
};