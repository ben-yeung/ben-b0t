const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

var codes = {
    "az": "Azerbaijan",
    "sq": "Albanian",
    "am": "Amharic",
    "en": "English",
    "ar": "Arabic",
    "hy": "Armenian",
    "af": "Afrikaans",
    "eu": "Basque",
    "ba": "Bashkir",
    "be": "Belarusian",
    "bn": "Bengali",
    "my": "Burmese",
    "bg": "Bulgarian",
    "bs": "Bosnian",
    "cy": "Welsh",
    "hu": "Hungarian",
    "vi": "Vietnamese",
    "ht": "Haitian (Creole)",
    "gl": "Galician",
    "nl": "Dutch",
    "mrj": "Hill Mari",
    "el": "Greek",
    "ka": "Georgian",
    "gu": "Gujarati",
    "da": "Danish",
    "he": "Hebrew",
    "yi": "Yiddish",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "is": "Icelandic",
    "es": "Spanish",
    "kk": "Kazakh",
    "kn": "Kannada",
    "ca": "Catalan",
    "ky": "Kyrgyz",
    "zh": "Chinese",
    "ko": "Korean",
    "xh": "Xhosa",
    "km": "Khmer",
    "lo": "Laotian",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mk": "Macedonian",
    "mi": "Maori",
    "mr": "Marathi",
    "mhr": "Mari",
    "mn": "Mongolian",
    "de": "German",
    "ne": "Nepali",
    "no": "Norwegian",
    "pa": "Punjabi",
    "pap": "Papiamento",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "ceb": "Cebuano",
    "sr": "Serbian",
    "si": "Sinhala",
    "sk": "Slovakian",
    "sl": "Slovenian",
    "sw": "Swahili",
    "su": "Sundanese",
    "tg": "Tajik",
    "th": "Thai",
    "tl": "Tagalog",
    "ta": "Tamil",
    "tt": "Tatar",
    "te": "Telugu",
    "tr": "Turkish",
    "udm": "Udmurt",
    "uz": "Uzbek",
    "uk": "Ukranian",
    "ur": "Urdu",
    "fi": "Finnish",
    "fr": "French",
    "hi": "Hindi",
    "hr": "Croatian",
    "cs": "Czech",
    "sv": "Swedish",
    "gd": "Scottish",
    "et": "Estonian",
    "eo": "Esperanto",
    "jv": "Javanese",
    "ja": "Japanese"
}

module.exports = {
    name: "trhelp",
    description: "Sends user embed of language codes for ?translate",
    usage: "?trhelp",
    async execute(bot, message, args) {

        let bigText = "Find the language code below and use it with ?translate [language code] [text] \n Translate [text] to given [language code] \n\n"
        for (let [key, value] of Object.entries(codes)) {
            bigText += `${key} : ${value} \n`
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("?translate Help")
            .setDescription(bigText)
            .setColor(colours.blue_light)

        try {
            await message.author.send({embeds:[embed]});
            message.react('❤️');
        } catch (err) {
            message.reply("You have DMs turned off! For server specific DMs: Right click server icon > Privacy Settings > Toggle Allow DMs ❤️ ")
        }

    }
}