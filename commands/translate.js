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
    name: "translate",
    description: "Translate message to given lang code.",
    usage: "?translate [lang code] [text] or ?translate [text] -> defaults to english translation",
    async execute(bot, message, args) {

        return message.reply("Module currently down.")

        let validLangs = Object.keys(codes)
        let lang = args[0].toLowerCase()
        let text = args.slice(1, args.length).join(" ").trim()
        if (!lang) return message.reply("Format is ?tr [lang code] [text] or ?tr [text] -> defaults to english translation. Use ?trhelp for the list of language codes")
        if (!text && validLangs.includes(lang)) return message.reply("You have to give me text to translate.")
        // if (lang.length !== 2) return message.reply("You must use a two letter indicator for the language to translate to. Do ?trhelp to see more.")

        if (!validLangs.includes(lang)) { // Try to translate given text to English
            translate(text, {to: 'en'}).then(res => {
                console.log(res)
                // let embed = new Discord.MessageEmbed()
                //     .setTitle(`Translate to ${codes[lang]}`)
                //     .addField("Original Message:", text)
                //     .addField("Translation:", res.text)
                //     .setColor(colours.blue_light)
                // return message.channel.send({
                //     embeds: [embed]
                // });
            }).catch(err => {
                console.error(err)
            })
            
        } else { // Translate text to given language code
            translate(text, {from: lang, to: 'en'}).then(res => {
                console.log(res)
                // let embed = new Discord.MessageEmbed()
                //     .setTitle(`Translate to ${codes[lang]}`)
                //     .addField("Original Message:", text)
                //     .addField("Translation:", res.text)
                //     .setColor(colours.blue_light)
                // return message.channel.send({
                //     embeds: [embed]
                // });
            }).catch(err => {
                console.error(err)
            })
        }
        

    }
}