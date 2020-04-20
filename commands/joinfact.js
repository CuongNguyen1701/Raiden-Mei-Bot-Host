const fs = require('fs');
const money = require('../money.json');
const faction = require('../faction.json');
const {currency, mongoPass} = require('../config.json');
const role = require('../roles.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//MODELS
const Data = require('../models/data.js');

module.exports = {
	name: 'joinfact',
	description: 'tham gia nhóm',
	execute(client, message, args) {
        let roleMember = message.guild.member(message.author);
        let user = message.author;

        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if(err) console.log(err);
            if(!data){ //check if user has no data on database
            return message.reply('please use ' + prefix + 'create first');
            }
            else
            {
                if(data.faction) return message.reply('you have already joined a faction!');
        
                if( money[message.author.id].money >= role.tier2.cost && (roleMember.roles.cache.has(role.tier2.id) 
                || roleMember.roles.cache.has( role.tier3.id)|| roleMember.roles.cache.has( role.tier4.id)|| roleMember.roles.cache.has( role.tier5.id)
                || roleMember.roles.cache.has( role.tier6.id)|| roleMember.roles.cache.has( role.tier7.id)|| roleMember.roles.cache.has( role.tier8.id)
                || roleMember.roles.cache.has( role.tier9.id)|| roleMember.roles.cache.has( role.tier10.id)))
                {
                    switch(args[0])
                    {
                        case 'Mei':
                            data.faction = args[0];
                            break;
                        case 'Kiana':
                            data.faction = args[0];

                            break;
                        case 'Bronya':
                            data.faction = args[0];

                            break;
                        case 'Himeko':
                            data.faction = args[0];

                            break;   
                        case 'Teri':
                            data.faction = args[0];

                            break;
                        case 'Fuhua':
                            data.faction = args[0];

                            break;
                        case 'Sakura':
                            data.faction = args[0];

                            break;
                        case 'Kallen':
                            data.faction = args[0];

                            break;
                        case 'Rita':
                            data.faction = args[0];

                            break;
                        case 'Seele':
                            data.faction = args[0];

                            break;    
                        case 'RozaLili':
                            data.faction = args[0];

                            break;
                        case 'Durandal':
                            data.faction = args[0];

                            break;    
                        default:
                            message.reply('please enter a valid faction');
                            return message.reply('valid factions: Mei, Bronya, Kiana, Himeko, Teri, Fuhua, Sakura, Kallen, Rita, Seele, RozaLili, Durandal');
            
                    }
                    data.money -= role.tier2.cost;
                    data.save().catch(err => console.log(err));
                    
        
        
                    return message.reply('you have successfully joined ' + data.faction + ' faction!');
        
        
                }
                else return message.reply('you need to be at least a' + role.tier2.name + 'and have at least ' + role.tier2.cost + currency + ' to join a faction');
                
            }
        })


        

	},
};