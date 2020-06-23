
const { currency } = require('../config.json');

const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');
const CoupData = require('../models/coupdata.js');


module.exports = {
    name: 'coup',
    description: 'kiểm tra giá trị cổ phiếu và số cổ phiếu trong kho',
    execute(client, message, args) {

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first to see your coupon');
            }
            else {
                if (!data.coup) data.coup = 0;
                SaveData(data);

                CoupData.findOne({
                    coupID: 'RaidenMei',
                }, (err, coupData) => {
                    if (err) console.log(err);
                    if (!coupData) {
                        const newCoupData = new CoupData({
                            coupID: 'RaidenMei',
                            refreshTime: 0,
                            coupValue: 105,
                        })
                        SaveData(newCoupData);
                    }
                    else {
                        message.channel.send('your coupon: ' + data.coup + '. Current coupon value: ' + coupData.coupValue + currency);
                    }
                })
            }
        })

    }
}
