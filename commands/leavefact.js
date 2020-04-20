
const {currency, mongoPass} = require('../config.json');
const role = require('../roles.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

//MODELS
const Data = require('../models/data.js');
module.exports = {
	name: 'leavefact',
	description: 'rời nhóm',
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
                if(!data.faction) 
                {
                    return message.reply("you haven't joined a faction!");
                }
                
                
                let cost = role.tier2.cost;
        
                if(roleMember.roles.cache.has(role.tier10.id)) cost = role.tier10.cost;
                else if(roleMember.roles.cache.has(role.tier9.id))cost = role.tier9.cost;
                else if(roleMember.roles.cache.has(role.tier8.id)) cost = role.tier8.cost;
                else if(roleMember.roles.cache.has(role.tier7.id)) cost = role.tier7.cost;
                else if(roleMember.roles.cache.has(role.tier6.id)) cost = role.tier6.cost;
                else if(roleMember.roles.cache.has(role.tier5.id)) cost = role.tier5.cost;
                else if(roleMember.roles.cache.has(role.tier4.id)) cost = role.tier4.cost;
                else if(roleMember.roles.cache.has(role.tier3.id)) cost = role.tier3.cost;
                else if(roleMember.roles.cache.has(role.tier2.id)) cost = role.tier2.cost;
                else if(roleMember.roles.cache.has(role.tier1.id)) cost = role.tier2.cost;
                else cost = role.tier2.cost;
        
        
                data.money -= cost;
        
                message.reply('you paid ' + cost + currency + ' and left ' + data.faction + ' faction' )
                
                data.faction = null;
                data.save().catch(err => console.log(err));
                
            }
        })
        


    },
};