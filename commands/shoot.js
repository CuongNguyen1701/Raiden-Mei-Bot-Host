
const mongoose = require('mongoose');
const Discord = require('discord.js');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Database Connected'))
	.catch(err => console.log(err));

//MODELS
const RpgData = require('../models/rpgdata.js');



module.exports = {
	name: 'shoot',
	description: 'bắn luôn(50 MP)',
	cooldown: 30,
	execute(client, message, args) {
		let user = message.mentions.members.first() || client.users.cache.get(args[0]);
		if (!user) return message.reply('cannot find that user!');
		if (user.id == message.author.id) return message.reply("don't hit yourself please");
		if(user.presence.status != 'online' &&user.presence.status != 'idle') 
		{
			return message.reply('user is not online or idle !');
		}
		if(message.author.presence.status != 'online' && message.author.presence.status != 'online')
		{
			return message.reply('please set your status to online or idle !');
		}
		
		let embed = new Discord.MessageEmbed();
        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min;}
        function SaveData(data) { data.save().catch(err => console.log(err)); }


		RpgData.findOne({//find author rpg data
			userID: message.author.id
		}, (err, author_rpgData) => {
			if (err) console.log(err);
			if (!author_rpgData) {
				return message.reply('please declare your existence using ' + prefix + 'char first!')
			}
			RpgData.findOne({//find user rpg data
				userID: user.id
			}, (err, user_rpgData) => {
				if (err) console.log(err);
				if (!user_rpgData) {
					return message.reply('user has not enter the map yet!');
                }
                var rangedType = ['archer', 'elf', 'ranger', 'sniper'];
                if(!rangedType.includes(author_rpgData.class))
                {
                    return message.reply('you have to be a ranged type to use this command! ranged type classes: ' + rangedType)
                }

                let range = 2;
                switch(author_rpgData.class)
                {
                    case rangedType[3]:
                        range++;
                        break;
                }
                
				//both directions' distance is larger than 1
				if ((Math.abs(author_rpgData.posY - user_rpgData.posY) > range) || (Math.abs(author_rpgData.posX - user_rpgData.posX) > range)) {
					return message.reply('user is too far away!');//out of 3x3 square
				}
				//else the player is nearby
				if(author_rpgData.hp <= 0) return message.reply('you are already dead!');
				if(user_rpgData.hp <= 0) return message.reply(user_rpgData.name + ' is already dead!');

				let dmg = parseInt(Math.log(author_rpgData.atk)/Math.log(user_rpgData.def) * 100) + RandInt(10, 50);
                let mpCost =50;
                if( author_rpgData.mp < mpCost) return message.reply("you don't have enough MP!");
                switch(author_rpgData.class)
                {
                    case rangedType[3]:
                        dmg *= 1.3
                        break;
                }
                author_rpgData.mp -= mpCost;
				user_rpgData.hp -= dmg;

				embed.setTitle(author_rpgData.name + ' attack!')
				embed.setDescription(author_rpgData.name + ' deal ' + dmg + ' damage to ' + user_rpgData.name + '!')
				if(user_rpgData.hp <= 0) 
				{
					user_rpgData.hp = 0;
					embed.addField(user_rpgData.name + ' is ded!', ' :skull: :skull: :skull:');
					
				}else{

					embed.addField(user_rpgData.name + ':heart: HP:  ', user_rpgData.hp + '/' + user_rpgData.maxHp);
				}
				SaveData(user_rpgData);
				SaveData(author_rpgData);

				message.channel.send(embed);


			})
		})

	},
};