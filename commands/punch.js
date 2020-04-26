
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

//MODELS
const Data = require('../models/data.js');


module.exports = {
	name: 'punch',
	description: 'đấm luôn',
	execute(client, message, args) {
        let user = message.mentions.members.first() || client.users.cache.get(args[0]);
        if(!user) return message.reply('cannot find that user!')
        if(user.id == message.author.id) return;

	},
};