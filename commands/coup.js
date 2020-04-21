
const { currency } = require('../config.json');

const { coupData } = require('../coup.json');

const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');

module.exports = {
    name: 'coup',
    description: 'kiểm tra giá trị cổ phiếu và số cổ phiếu trong kho',
    execute(client, message, args) {
        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first to see your coupon');
            }
            else{
                message.channel.send('your coupon: '+ data.coup +'. Current coupon value: ' + coupData.coupValue + currency);
                
            }
        })

    }
}
