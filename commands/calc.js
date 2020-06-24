
const mongoose = require('mongoose');
const Discord = require('discord.js');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const CalcData = require('../models/calcdata.js');

module.exports = {
    name: 'calc',
    description: 'calculate the final dmg multiplier',
    execute(client, message, args) {
        let user = message.author;
        function SaveData(data) { data.save().catch(err => console.log(err)); }
        CalcData.findOne({
            userID: user.id
        }, (err, calcData) => {
            if (!calcData) {
                var newData = new CalcData({
                    name: client.users.cache.get(user.id).username,
                    userID: user.id,
                    lv: 80,
                    atk: 1000,
                    crt: 100,
                    bonus_crit: 0,
                    tdm: 0,
                    tdm_r: 0,
                    phys: 0,
                    phys_r: 0,
                    cdm: 0,
                    ele: 0,
                    ele_r: 0,
                })
                SaveData(newData);
            }
            let data = newData || calcData;
            const { lv: lv, atk: atk, crt: crt, bonus_crit: bonus_crit, tdm: tdm, tdm_r: tdm_r, phys: phys, phys_r: phys_r, cdm: cdm, ele: ele, ele_r: ele_r } = data;
            function Calc(buffType) {
                let result = 1 + buffType / 100
                return result;
            }
            let base = (atk / 10) * Calc(tdm) * Calc(tdm_r);

            let embed = new Discord.MessageEmbed();

            let fdm_phys_noCrit = Math.round(base * Calc(phys) * Calc(phys_r));
            let fdm_phys_yesCrit = Math.round(fdm_phys_noCrit * (2 + cdm / 100));
            let fdm_ele = Math.round(base * Calc(ele) * Calc(ele_r));
            let critRate = Math.round((crt / (lv * 5 + 75)) * 100 + bonus_crit);
            if (critRate > 100) critRate = 100;
            embed.setTitle(`${data.name}'s calculation`);
            embed.addField(`LV:`, lv, true)
            embed.addField(`ATK:`, atk, true)
            embed.addField(`CRT:`, crt, true)
            embed.addField(`bonus crit:`, `${bonus_crit}%`, true)
            embed.addField(`TDM:`, `${Calc(tdm)}%`, true)
            embed.addField(`TDM received:`, `${Calc(tdm_r)}%`, true)
            embed.addField(`phys:`, `${Calc(phys)}%`, true)
            embed.addField(`phys received:`, `${Calc(phys_r)}%`, true)
            embed.addField(`crit damage:`, `${cdm}%`, true)
            embed.addField(`ele:`, `${ele}%`, true)
            embed.addField(`ele received:`, `${ele_r}%`)

            embed.addField(`physical final multiplier(without crit):`, `${fdm_phys_noCrit}%`, true);
            embed.addField(`physical final multiplier(with crit):`, `${fdm_phys_yesCrit}%`);
            embed.addField(`elemental final multiplier:`, `${fdm_ele}%`);
            embed.addField(`final crit rate:`, `${critRate}%`);
            message.channel.send(embed);




        })
    }

}