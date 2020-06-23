
module.exports = {
	name: 'kiss',
	description: 'kiss the mentioned user <3',
	execute(client, message, args) {
        let member = message.mentions.members.first();
        giphy.search('gifs',{'q': 'anime punch'})
        .then((response) => {
            var totalResponses = response.data.length;
            var responseIndex = Math.floor((Math.random()*15)+1) % totalResponses;
            var responseFinal = response.data[responseIndex];
            
            message.channel.send(message.author.username + ' kissed ' + member.displayName + '!',{
                files: [responseFinal.images.fixed_height.url] 
            })
        }).catch(() =>{
            message.channel.send('Error!');
        })
	},
};
