
const {mongoPass ,currency, pCurrency} = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));
//MODELS
const Data = require('../models/data.js');
/*
data.findOne({
    userID: message.author.id
}, (err, data) => {
    if(err) console.log(err);
    if(!data){ //check if user has no data on database
    return message.reply('please use ' + prefix + 'create first');
    }
    else
    {
        data.save().catch(err => console.log(err));
        
    }
})
*/
module.exports = {
	name: 'balance',
	description: 'tài khoản',
	execute(client, message, args) {
        
        //check if no first argument is provided(user mentioned) 
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
                const newData = new Data({
                    name: client.users.cache.get(user.id).username,
                    userID: user.id,
                    lb: 'all',
                    money: 0,
                    pMoney: 0,
                    faction: null,
                    daily: null,
                    investMoney: null,
                    investCD: false,
                    investStonks: true,

                })
                newData.save().catch(err => console.log(err));
                return message.channel.send(client.users.cache.get(user.id).username + ' has 0' + currency + ' and 0 '+ pCurrency);

            } else {
                return message.channel.send(client.users.cache.get(user.id).username + ' has ' + data.money + currency + ' and ' + data.pMoney + pCurrency);
            }
        })

	},
};