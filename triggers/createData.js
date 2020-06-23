const mongoose = require('mongoose');
const Discord = require('discord.js');
const color = require('../color.json');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const data = require('../models/data.js');

module.exports = {
    execute(client, user) {
        function RandInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

        function SaveData(data) { data.save().catch(err => console.log(err)); }
        var newData = new data({
            name: client.users.cache.get(user.id).username,
            userID: user.id,
            level: 1,
            lb: 'all',
            class: 'newbie',
            pos: { x: RandInt(1, 10), y: RandInt(1, 10), },
            stats:
            {
                hp: 100, maxHp: 100,
                mp: 100, maxMp: 100,
                atk: 10, def: 10,
            }


        })
        SaveData(newData);
    },
};