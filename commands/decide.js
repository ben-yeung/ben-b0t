const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    let r = [maxIndex, max];
    return r;
}

module.exports = {
    name: "decide",
    description: "Chooses between given choices with Math.random()",
    usage: "?decide [choice] or [choice] or ... [choice]",
    execute(bot, message, args) {

        if (args.indexOf("or") > -1) {
            let orCount = 0
            var i;
            for (i = 0; i < args.length; i++) {
                if (args[i].localeCompare("or") == 0) {
                    orCount++
                }
            }
            let choices = new Array(orCount + 1)
            let ind = 0
            var c;
            let game = ""
            for (c = 0; c < args.length; c++) {
                if (args[c].localeCompare("or") != 0) {
                    game += args[c] + " "
                    if (c == args.length - 1) {
                        choices[ind] = game
                        break;
                    }
                } else {
                    choices[ind] = game
                    ind++
                    game = ""
                }
            }
            console.log(choices)
            // let percs = new Array(choices.length);
            // for (i = 0; i < choices.length; i++) {
            //     percs[i] = Math.floor(Math.random() * 100);
            // }
            // let maxes = indexOfMax(percs);
            // let maxNum = maxes[1];
            // let maxInd = maxes[0];
            let choice = choices[Math.floor(Math.random() * choices.length)]

            let phrases = ['I asked my mom and she said you should', 'My guy feeling says', 'Local expert recommended you should', 'Siri said', 'If I were you I would', 'This is a good choice:', 'I would definitely choose', 'Survey says:', 'My gut says you should', 'The obvious choice is', 'If I were you I would']
            let phraseChoice = phrases[Math.floor(Math.random() * phrases.length)]
            message.channel.send(`${phraseChoice} ${choice}`);
        } else {
            return message.reply("You must enter two choices separated by 'or' EX: '?decide do homework or play basketball")
        }

    }
}