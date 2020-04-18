
module.exports = {
    name: 'pong',
    description: 'Pong.',
    execute(client, message, args) {
        message.channel.send('Ping!');
    },
};