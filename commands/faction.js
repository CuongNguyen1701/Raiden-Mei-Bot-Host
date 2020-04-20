
const {mongoPass} = require('../config.json');
const role = require('../roles.json');
const mongoose = require('mongoose');

//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

//MODELS
const Data = require('../models/data.js');

module.exports = {
	name: 'faction',
	description: 'xem nhóm',
	execute(client, message, args) {

        if(!args[0]){
            var user = message.author;
        }else{
            var user = message.mentions.users.first() || client.users.cache.get(args[0]); 
        }

        Data.findOne({
            userID: user.id
        }, (err, data) => {
            if(err) console.log(err);
            if(!data){ //check if user has no data on database
            return message.reply('user has to use ' + prefix + 'create first');
            }
            else
            {
                if(!data.faction) return message.reply(client.users.cache.get(user.id).username + " isn't in any faction!");
                else message.channel.send(client.users.cache.get(user.id).username + ' is in ' + data.faction + ' faction!');
            }
        })



    },
};