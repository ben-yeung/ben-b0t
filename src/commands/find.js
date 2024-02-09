const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");
var Scraper = require("images-scraper");
const db = require("quick.db");
const ms = require("ms");
var google = new Scraper({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  safe: true,
});

function pruneQueries(author) {
  let queries = db.get(`${author.id}.findquery`);
  if (!queries) return;

  for (const [key, val] of Object.entries(queries)) {
    if (Date.now() - val[2] >= 120000) {
      delete queries[key];
      console.log("PRUNED A QUERY");
    }
  }
  db.set(`${author.id}.findquery`, queries);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription("Search Google Images for a given query.")
    .addStringOption((option) => option.setName("query").setDescription("What would you like to see today?").setRequired(true)),
  options: "[query]",
  async execute(interaction, args, client) {
    const author = interaction.user;
    if (db.get(`${author.id}.findstarted`) && Date.now() - db.get(`${author.id}.findstarted`) <= 10000) {
      return interaction.reply({
        content: `Please close your most recent find command or wait ${ms(
          10000 - (Date.now() - db.get(`${author.id}.findstarted`))
        )} before starting another query!`,
        ephemeral: true,
      });
    } else {
      db.set(`${author.id}.findstarted`, Date.now());
      pruneQueries(author);
    }

    let search = interaction.options.getString("query");

    const intros = [
      "Searching the web for",
      "Scouring the web for",
      "Researching scholarly articles for",
      "Surfing the web for",
      "Checking a picture book for",
      "Feeling lucky? Looking for",
      "Hey Alexa, what is a",
      "Hey Siri, what is a",
      "Asking a professor for",
    ];
    let choice = intros[Math.floor(Math.random() * intros.length)];
    await interaction.reply(`${choice} \`${search}\` <a:working:821570743329882172>`);

    const img_res = await google.scrape(search, 10);
    // console.log(img_res)
    // console.log("\n----------------------------------------")
    if (!img_res.length) return interaction.reply("No images found with these keywords. It might be NSFW 😳");

    let currInd = 0;
    let chosenOne = img_res[currInd].url;
    let chosenOneSRC = img_res[currInd].source;

    let embed = new Discord.EmbedBuilder()
      .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
      .setDescription(`Asker: <@${author.id}> \n`)
      .setColor(botconfig.COLOR_SCHEME)
      .setImage(chosenOne)
      .setTimestamp();

    const nextBtn = new ButtonBuilder().setLabel("Next").setCustomId("find_next").setStyle("Primary");

    const prevBtn = new ButtonBuilder().setLabel("Prev").setCustomId("find_prev").setStyle("Primary");

    const closeBtn = new ButtonBuilder().setLabel("Close").setCustomId("find_close").setStyle("Danger");

    const sourceBtn = new ButtonBuilder().setLabel("Source").setURL(chosenOneSRC).setStyle("Link");

    prevBtn.disabled = true;
    const row =
      img_res.length > 1
        ? new ActionRowBuilder().addComponents(prevBtn, nextBtn, sourceBtn, closeBtn)
        : new ActionRowBuilder().addComponents(sourceBtn, closeBtn);

    await interaction.editReply({ content: " ­", embeds: [embed], components: [row] });
    const message = await interaction.fetchReply();

    if (img_res.length == 1) return;

    if (!db.get(`${author.id}.findquery`)) {
      let currQueries = {};
      currQueries[message.id] = [img_res, currInd, Date.now()];
      db.set(`${author.id}.findquery`, currQueries);
    } else {
      let currQueries = db.get(`${author.id}.findquery`);
      currQueries[message.id] = [img_res, currInd, Date.now()];
      db.set(`${author.id}.findquery`, currQueries);
    }

    //   console.log(db.get(`${author.id}.findquery`));

    const filter = (btn) => {
      return btn.user.id === interaction.user.id && btn.message.id == message.id;
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 120000,
    });

    collector.on("collect", async (btn) => {
      const id = btn.customId;

      let queries = db.get(`${author.id}.findquery`);
      //   console.log(queries);
      let img_res = queries[btn.message.id][0];
      var currInd = queries[btn.message.id][1];

      if (id === "find_next") {
        prevBtn.disabled = false;
        currInd++;
        queries[btn.message.id][1] = currInd;
        db.set(`${author.id}.findquery`, queries);
        let chosenOne = img_res[currInd].url;
        let chosenOneSRC = img_res[currInd].source;
        let embed = new Discord.EmbedBuilder()
          .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
          .setDescription(`Asker: <@${author.id}> \n`)
          .setColor(botconfig.COLOR_SCHEME)
          .setImage(chosenOne)
          .setTimestamp();

        if (currInd == 9 || currInd == img_res.length) {
          nextBtn.disabled = true;
        } else {
          nextBtn.disabled = false;
        }

        sourceBtn.setURL(chosenOneSRC);
        const row = new ActionRowBuilder().addComponents(prevBtn, nextBtn, sourceBtn, closeBtn);
        await interaction.editReply({
          components: [row],
          embeds: [embed],
        });
      } else if (id === "find_prev") {
        nextBtn.disabled = false;
        currInd--;
        queries[btn.message.id][1] = currInd;
        db.set(`${author.id}.findquery`, queries);
        let chosenOne = img_res[currInd].url;
        let chosenOneSRC = img_res[currInd].source;
        let embed = new Discord.EmbedBuilder()
          .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
          .setDescription(`Asker: <@${author.id}> \n`)
          .setColor(botconfig.COLOR_SCHEME)
          .setImage(chosenOne)
          .setTimestamp();

        if (currInd === 0) {
          prevBtn.disabled = true;
        }

        sourceBtn.setURL(chosenOneSRC);
        const row = new ActionRowBuilder().addComponents(prevBtn, nextBtn, sourceBtn, closeBtn);
        await interaction.editReply({
          components: [row],
          embeds: [embed],
        });
      } else if (id === "find_close") {
        interaction.deleteReply();
        db.delete(`${author.id}.findstarted`);
        delete queries[btn.message.id];
        db.set(`${author.id}.findquery`, queries);
        return;
      }

      btn.deferUpdate();
    });
  },
};
