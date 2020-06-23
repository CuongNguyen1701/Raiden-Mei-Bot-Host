module.exports = {
	name: 'ching',
	description: 'Ching!',
	execute(client, message, args) {
		message.channel.send('chong!');
	},
};