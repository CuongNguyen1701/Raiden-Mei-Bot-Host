
const {currency, mongoPass} = require('../config.json');
const Discord = require('discord.js');
const role = require('../roles.json');


const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

//MODELS
const Data = require('../models/data.js');


module.exports = {
	name: 'promote',
	description: 'thăng chức, fire faction chỉ cần 75% lượng tiền để thăng chức',
	execute(client, message, args) {
        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed;

        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }
        function SaveData(data) { data.save().catch(err => console.log(err)); }

        function Promote(currentTier, promoteTier, data)
        {
            if(data.faction == 'fire') promoteTier.cost *= 0.75
            //check if the balance have enough money to promote
            if(data.money < promoteTier.cost) return message.reply('you do not have enough money, you need at least ' + promoteTier.cost + currency + ' to become a ' + promoteTier.name);

            data.money -= promoteTier.cost;
            SaveData(data);
            if (currentTier != null) roleMember.roles.remove(currentTier.id);//use for cases when user has no eco role
            
            roleMember.roles.add(promoteTier.id);

            message.channel.send(message.author.username + ' is a'+ promoteTier.name +'now! Current balance: ' + data.money + currency);
        }

        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if(err) console.log(err);
            if(!data){ //check if user has no data on database
            return message.reply('please use ' + prefix + 'create first');
            }
            else
            {
                if(hasTier(role.tier2) && !data.faction) return message.reply('you have to join a faction in order to be promoted!');

                switch (hasTier(role.tier1) ? 1 : (hasTier(role.tier2) && data.faction) ? 2 : 
                hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
                    hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
                        hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
                            hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0) {
                case 1: Promote(role.tier1, role.tier2, data); break;
                case 2: Promote(role.tier2, role.tier3, data); break;
                case 3: message.reply('wonder what could beyond this?'); break;
                case 4: Promote(role.tier4, role.tier5, data); break;
                case 5: Promote(role.tier5, role.tier6, data); break;
                case 6: message.reply('you are already at the top of the food chain!'); break;
                case 7: Promote(role.tier7, role.tier8, data); break;
                case 8: message.reply('you are already at the top of the world!'); break;
                case 9: Promote(role.tier9, role.tier10, data); break;
                case 10: message.reply('you have already completed the game!'); break;
                case 0: Promote( null , role.tier1, data); break;//no role case
            }
                
            }
        })



    },
};