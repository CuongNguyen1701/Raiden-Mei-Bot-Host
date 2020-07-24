const fs = require('fs');
const Discord = require('discord.js');
const { prefix, noPrefix, token, giphyToken } = require('./config.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const cooldowns = new Discord.Collection();


var GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giphyToken);


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
    if (command.aliases) {
        command.aliases.forEach(alias => client.aliases.set(alias, command.name));
    }
}




//BOT ONLINE MESSAGE AND ACTIVITY MESSAGE

client.on('ready', async () => {
    console.log('Ready!');
    client.user.setActivity('with NeoVNHouse!')
})


client.on('message', message => {
    //check if the message author is a bot
    if (message.author.bot) return;

    // const commandName_noPrefix = message.content.toLowerCase();
    // const command_noPrefix = message.client.commands.get(commandName_noPrefix);

    // switch (commandName_noPrefix) {
    //     case '': command_noPrefix.execute(message, args); break;
    //     case '': command_noPrefix.execute(message, args); break;
    // }



    //check if the message has any prefix 
    if (!message.content.startsWith(prefix)) return;


    const args = message.content.slice(prefix.length).split(/ +/);

    const commandName = args.shift().toLowerCase();
    // const commandArray = [...message.client.commands.keys()]
    const command = message.client.commands.get(commandName)
        || message.client.commands.get(message.client.aliases.get(commandName));



    if (!command) return;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        //perform the command with the same name in commands folder
        command.execute(client, message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }


    //


})
client.login(process.env.token);
