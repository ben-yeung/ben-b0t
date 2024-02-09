const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");
const weather = require("weather-js");
const db = require("quick.db");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");

function tConvert(time) {
  // Check correct time format and split into components
  time = time.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[0] = +time[0] % 12 || 12; // Adjust hours
    time.splice(time.length - 1); // Delete seconds
  }
  return time.join(""); // return adjusted time or original string
}

function dConvert(date) {
  date = date.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/) || [date];

  if (date.length > 1) {
    date = date.slice(1);
    if (date[0][0] == "0") {
      date[0] = date[0][1];
    }
    let res = date[0] + "/" + date[1];
    return res;
  }
  return date.join("");
}

function getPrecip(forecast) {
  if (forecast.precip == "") return "N/A";
  else return forecast.precip + "%";
}

function pruneQueries() {
  let queries = db.get(`weather_queries`);
  if (!queries) return;

  for (const [key, val] of Object.entries(queries)) {
    if (Date.now() - val[2] >= 120000) {
      delete queries[key];
      console.log("PRUNED A QUERY");
    }
  }
  db.set(`weather_queries`, queries);
}

function fetchDetails(current, location) {
  const embed = new Discord.EmbedBuilder()
    .setTitle(`Weather in ${current.observationpoint}`)
    .setColor(colors.gold)
    .setDescription(`**${current.day} (${dConvert(current.date)})** \n> ${current.skytext}\n`)
    .setThumbnail(current.imageUrl)
    .addFields([
      { name: "Temperature", value: `${current.temperature}°F`, inline: true },
      { name: "It Feels Like", value: `${current.feelslike}°F`, inline: true },
      { name: "Winds", value: current.winddisplay, inline: true },
      { name: "Humidity", value: `${current.humidity}%`, inline: true },
      { name: "Observed", value: `${tConvert(current.observationtime)}`, inline: true },
      { name: "Timezone", value: `GMT ${location.timezone}`, inline: true },
      { name: "Temperature", value: `${current.temperature}°F`, inline: true },
      { name: "Temperature", value: `${current.temperature}°F`, inline: true },
    ])
    // .addField("Temperature", `${current.temperature}°F`, true)
    // .addField("It Feels Like", `${current.feelslike}°F`, true)
    // .addField("\u200B", "\u200B", true)
    // .addField("Winds", current.winddisplay, true)
    // .addField("Humidity", `${current.humidity}%`, true)
    // .addField("\u200B", "\u200B", true)
    // .addField("Observed", `${tConvert(current.observationtime)}`, true)
    // .addField("Timezone", `GMT ${location.timezone}`, true)
    // .addField("\u200B", "\u200B", true)
    .setTimestamp();

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Fetches the weather for a given location.")
    .addStringOption((option) => option.setName("city").setDescription("What's the weather in [city]?").setRequired(true)),
  options: "[location]",
  async execute(interaction, args, client) {
    let city = interaction.options.getString("city");
    let degreeType = "F";
    pruneQueries();

    await weather.find(
      {
        search: city,
        degreeType: degreeType,
      },
      async function (err, result) {
        if (err || result === undefined || result.length === 0)
          return interaction.reply({
            content: `Error finding the given city: **${city}**. Please check for typos. If this is a real city then tell Ben his code broke.`,
            ephemeral: true,
          });

        let current = result[0].current;
        let location = result[0].location;
        let forecast = result[0].forecast;
        var skycodes = [];
        //console.log(forecast)

        for (var i = 0; i < forecast.length; i++) {
          switch (forecast[i].skycodeday) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "17":
            case "35":
            case "37":
            case "38":
            case "47":
              skycodes.push(":thunder_cloud_rain:");
              break;
            case "5":
            case "6":
            case "7":
            case "13":
            case "14":
            case "16":
            case "42":
            case "43":
            case "15":
            case "41":
            case "46":
              skycodes.push(":cloud_snow:");
              break;
            case "8":
            case "25":
              skycodes.push(":snowflake:");
              break;
            case "9":
            case "10":
            case "11":
            case "12":
            case "18":
            case "40":
            case "39":
            case "45":
              skycodes.push(":cloud_rain:");
              break;
            case "19":
              skycodes.push(":dash:");
              break;
            case "20":
            case "21":
            case "22":
              skycodes.push(":fog:");
              break;
            case "23":
            case "24":
              skycodes.push(":wind_blowing_face:");
              break;
            case "26":
            case "27":
            case "29":
            case "33":
              skycodes.push(":cloud:");
              break;
            case "28":
              skycodes.push(":white_sun_cloud:");
              break;
            case "30":
            case "34":
              skycodes.push(":partly_sunny:");
              break;
            case "31":
            case "32":
              skycodes.push(":sunny:");
              break;
            case "36":
              skycodes.push(":fire:");
              break;

            default:
              skycodes.push(":alien:");
              break;
          }
        }

        const embed = await fetchDetails(current, location);

        const nextBtn = new ButtonBuilder().setLabel("Show Forecast").setCustomId("weather_next").setStyle("Primary");

        const backBtn = new ButtonBuilder().setLabel("Show Conditions").setCustomId("weather_back").setStyle("Primary");

        const closeBtn = new ButtonBuilder().setLabel("Close").setCustomId("weather_close").setStyle("Danger");

        const row = new ActionRowBuilder().addComponents(nextBtn, closeBtn);

        await interaction.reply({
          components: [row],
          embeds: [embed],
        });

        const message = await interaction.fetchReply();

        if (!db.get("weather_queries")) {
          queries = {};
          queries[message.id] = [[current, location, forecast], Date.now()];
          db.set("weather_queries", queries);
        } else {
          queries = db.get("weather_queries");
          queries[message.id] = [[current, location, forecast], Date.now()];
          db.set("weather_queries", queries);
        }

        const filter = (btn) => {
          return interaction.user.id === btn.user.id && btn.message.id == message.id;
        };

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 120000,
        });

        collector.on("collect", async (btn) => {
          //console.log(btn.customId)
          const id = btn.customId;
          let allQueries = db.get("weather_queries");
          let queries = allQueries[btn.message.id];
          let current = queries[0][0];
          let location = queries[0][1];
          let forecast = queries[0][2];
          // console.log(allQueries)

          if (id === "weather_next") {
            let embed = new Discord.EmbedBuilder()
              .setTitle(`Forecast for ${current.observationpoint}`)
              .setColor(colors.gold)
              .addFields([
                {
                  name: `${forecast[0].day}  (${dConvert(forecast[0].date)})`,
                  value: `> ${forecast[0].skytextday} \u200B ${skycodes[0]} \n High: **${forecast[0].high}°F**  |  Low: **${
                    forecast[0].low
                  }°F**  |  Precip: **${getPrecip(forecast[0])}**\n`,
                },
                {
                  name: `${forecast[1].day}  (${dConvert(forecast[1].date)})`,
                  value: `> ${forecast[1].skytextday} \u200B ${skycodes[1]} \n High: **${forecast[1].high}°F**  |  Low: **${
                    forecast[1].low
                  }°F**  |  Precip: **${getPrecip(forecast[1])}**\n`,
                },
                {
                  name: `${forecast[2].day}  (${dConvert(forecast[2].date)})`,
                  value: `> ${forecast[2].skytextday} \u200B ${skycodes[2]} \n High: **${forecast[2].high}°F**  |  Low: **${
                    forecast[2].low
                  }°F**  |  Precip: **${getPrecip(forecast[2])}**\n`,
                },
                {
                  name: `${forecast[3].day}  (${dConvert(forecast[3].date)})`,
                  value: `> ${forecast[3].skytextday} \u200B ${skycodes[3]} \n High: **${forecast[3].high}°F**  |  Low: **${
                    forecast[3].low
                  }°F**  |  Precip: **${getPrecip(forecast[3])}**\n`,
                },
                {
                  name: `${forecast[4].day}  (${dConvert(forecast[4].date)})`,
                  value: `> ${forecast[4].skytextday} \u200B ${skycodes[4]} \n High: **${forecast[4].high}°F**  |  Low: **${
                    forecast[4].low
                  }°F**  |  Precip: **${getPrecip(forecast[4])}**\n`,
                },
              ])
              .setTimestamp();

            const row = new ActionRowBuilder().addComponents(backBtn, closeBtn);
            await interaction.editReply({
              components: [row],
              embeds: [embed],
            });
          } else if (id === "weather_back") {
            const embed = await fetchDetails(current, location);

            const row = new ActionRowBuilder().addComponents(nextBtn, closeBtn);
            await interaction.editReply({
              components: [row],
              embeds: [embed],
            });
          } else if (id == "weather_close") {
            await interaction.deleteReply(); // Delete bot embed
          }

          btn.deferUpdate();
        });
      }
    );
  },
};
