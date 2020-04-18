

module.exports = {
	name: 'kick',
	description: 'kick the mentioned user',
	execute(client, message, args) {

        if(message.author.id != '609937407445434384') return message.reply('you cannot use this command!');

        
        if (!message.mentions.users.size) {
            return message.reply('you need to tag a user in order to kick them!');
        }
        
        let member = message.mentions.members.first();
        member.kick().then((member) => {
            
            giphy.search('gifs',{'q': 'kick'})
            .then((response) => {
                var totalResponses = response.data.length;
                var responseIndex = Math.floor((Math.random()*10)+1) % totalResponses;
                var responseFinal = response.data[responseIndex];
                
                message.channel.send(':wave:' + member.displayName + ' has been kicked!', {
                    files: [responseFinal.images.fixed_height.url] 
                })
            }).catch(() =>{
                message.channel.send('Error!');
            })
        })
        
	},
};
/*
module.exports = {
	name: 'approve',
	description: 'approve a member',
	execute(message, args) {
        const role = .roles.cache.find(role => role.name === 'Neo Member');
        const member = message.mentions.members.first();
        member.roles.add(role);
        message.channel.send(member.displayName + 'is now a Neo Member')
	},
};*/