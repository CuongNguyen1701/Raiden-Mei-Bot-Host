



module.exports = {
	name: 'slap',
	description: 'slap the mentioned user',
	execute(client, message, args) {
        let member = message.mentions.members.first();
        giphy.search('gifs',{'q': 'anime slap'})
        .then((response) => {
            var totalResponses = response.data.length;
            var responseIndex = Math.floor((Math.random()*20)+1) % totalResponses;
            var responseFinal = response.data[responseIndex];
            
            message.channel.send('slap ' + member.displayName + '!',{
                files: [responseFinal.images.fixed_height.url] 
            })
        }).catch(() =>{
            message.channel.send('Error!');
        })
	},
};

/*
module.exports = {
	name: '',
	description: '',
	execute(message, args) {
        let member = message.mentions.members.first();
		message.channel.send('');
	},
};
*/