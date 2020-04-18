module.exports = {
	name: 'slash',
	description: 'slash the enemy',
	execute(client, message, args) {
        let member = message.mentions.members.first();
        giphy.search('gifs',{'q': 'anime sword'})
        .then((response) => {
            var totalResponses = response.data.length;
            var responseIndex = Math.floor((Math.random()*20)+1) % totalResponses;
            var responseFinal = response.data[responseIndex];
            
            message.channel.send('slash ' + member.displayName + '!',{
                files: [responseFinal.images.fixed_height.url] 
            })
        }).catch(() =>{
            message.channel.send('Error!');
        })
	},
};