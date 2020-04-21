
const { currency } = require('../config.json');

const { coupData } = require('../coup.json');


module.exports = {
    name: 'coup',
    description: 'kiểm tra giá trị cổ phiếu',
    execute(client, message, args) {
        message.channel.send('current coupon value: ' + coupData.coupValue + currency)
    }
}
