const fs = require('fs');
const Discord = require('discord.js');
const {prefix, noPrefix , token, giphyToken} = require('./config.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const client = new Discord.Client();
client.commands = new Discord.Collection();


var GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giphyToken);


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}




//BOT ONLINE MESSAGE AND ACTIVITY MESSAGE

client.on('ready', async () => {
    console.log('Ready!');
    client.user.setActivity('with NeoVNHouse!')
})


client.on('message', message => 
{   
    //check if the message author is a bot
    if(message.author.bot) return;

    const commandName_noPrefix = message.content.toLowerCase();
    const command_noPrefix = message.client.commands.get(commandName_noPrefix);

    switch(commandName_noPrefix)
    {
        case'alo mei': command_noPrefix.execute(message, args); break;
        case'mei ơi': command_noPrefix.execute(message, args); break;
    }
    


    //check if the message has any prefix 
    if (!message.content.startsWith(prefix)) return;

    
    const args = message.content.slice(prefix.length).split(/ +/);

    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName)
    || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    


    if (!client.commands.has(commandName)) return;
    
    try 
    {
        //perform the command with the same name in commands folder
        command.execute(client, message, args);
    } 
    catch (error) 
    {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
        

    

   
})
client.login(process.env.token);
