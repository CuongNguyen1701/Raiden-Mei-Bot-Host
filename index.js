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
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName)
    || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    const commandName_noPrefix = message.content.toLowerCase();
    const command_noPrefix = message.client.commands.get(commandName_noPrefix);
    if (message.author.bot) return;
    
    if(commandName_noPrefix === 'alo mei')
    {
        command_noPrefix.execute(message, args);
    }

    if(commandName_noPrefix === 'mei ơi')
    {
        command_noPrefix.execute(message, args);
    }


    if (!client.commands.has(commandName)) return;
    
    try 
    {
        command.execute(client, message, args);
    } 
    catch (error) 
    {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
        

    

   
})
client.login(token);
