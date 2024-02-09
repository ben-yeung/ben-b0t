const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");
const StockXData = require("stockx-data");
const stockx = new StockXData();
const db = require("quick.db");
const ms = require("ms");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");

const stockxThumb = "https://styles.redditmedia.com/t5_3m7es/styles/communityIcon_0rxp025njnt61.png";

// Helper to fetch al details and construct an embed
function fetchDetails(productDetail, currInd) {
  let name = productDetail.name;
  let thumbnail = productDetail.image;
  let styleID = productDetail.pid || "N/A";
  let retail = productDetail.details.retail ? `$${productDetail.details.retail}` : "N/A";
  let releaseDate = productDetail.details.releaseDate || "N/A";
  let colorway = productDetail.details.colorway || "N/A";
  let lowestAsk = productDetail.market.lowestAsk ? `$${productDetail.market.lowestAsk}` : "N/A";
  let highestBid = productDetail.market.highestBid ? `$${productDetail.market.highestBid}` : "N/A";
  let totalSales = `${productDetail.market.deadstockSold}` || "N/A";
  let lastSale = productDetail.market.lastSale ? `$${productDetail.market.lastSale}` : "N/A";
  let lastSaleSize = productDetail.market.lastSaleSize ? `| Size ${productDetail.market.lastSaleSize}` : "";
  let annualHigh = productDetail.market.annualHigh ? `$${productDetail.market.annualHigh}` : "N/A";
  let annualLow = productDetail.market.annualLow ? `$${productDetail.market.annualLow}` : "N/A";

  let embed = new Discord.EmbedBuilder()
    .setTitle(`**${name}**`)
    .setDescription(`**Released:** ${releaseDate} \n`)
    .setColor(colors.stockx)
    .addFields([
      { name: "Lowest Ask", value: lowestAsk, inline: true },
      { name: "Highest Bid", value: highestBid, inline: true },
      { name: "Total Sales", value: totalSales, inline: true },
      { name: "Last Sale", value: lastSale, inline: true },
      { name: "Annual High", value: annualHigh, inline: true },
      { name: "Annual Low", value: annualLow, inline: true },
    ])
    // .addField("\u200B", "\u200B", true)
    .setThumbnail(thumbnail)
    .setFooter({ text: `Page ${currInd + 1}` })
    .setTimestamp();

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stockx")
    .setDescription("Pulls up StockX stats on a given search query.")
    .addStringOption((option) => option.setName("query").setDescription("What to search for on StockX").setRequired(true)),
  options: "[query]",
  async execute(interaction, args, client) {
    let search = interaction.options.getString("query");
    const author = interaction.user;

    if (db.get(`${author.id}.stockxstarted`) && Date.now() - db.get(`${author.id}.stockxstarted`) <= 15000) {
      return interaction.reply({
        content: `Please close your most recent stockx command or wait ${ms(
          15000 - (Date.now() - db.get(`${author.id}.stockxstarted`))
        )} before starting another query!`,
        ephemeral: true,
      });
    } else {
      db.set(`${author.id}.stockxstarted`, Date.now());
    }

    const intros = [
      "Searching StockX for",
      "Scouring StockX for",
      "Researching scholarly articles on StockX for",
      "Paying resell to find",
      "Checking a StockX picture book for",
      "Feeling resell lucky? Looking for",
      "Hey Alexa, look on StockX for",
      "Hey Siri, search on StockX for",
      "Asking a reseller for",
    ];
    let choice = intros[Math.floor(Math.random() * intros.length)];
    await interaction.reply(`${choice} \`${search}\` <a:stockx:872713212901093486>`);
    try {
      stockx.searchProducts(search).then(async (productFound) => {
        if (productFound.length == 0) {
          db.delete(`${author.id}.stockxstarted`);
          return interaction.editReply({ content: "Could not find results on StockX for that search.", ephemeral: true });
        }
        var currInd = 0;
        var productDetail = await stockx.fetchProductDetails(productFound[currInd].uuid);
        let sourceURL = `https://stockx.com/${productDetail.market.productUuid}`;

        let embed = await fetchDetails(productDetail, 0);

        const nextBtn = new ButtonBuilder().setLabel("Next").setCustomId("stockx_next").setStyle("Primary");

        const prevBtn = new ButtonBuilder().setLabel("Prev").setCustomId("stockx_prev").setStyle("Primary");

        const closeBtn = new ButtonBuilder().setLabel("Close").setCustomId("stockx_close").setStyle("Danger");

        const sourceBtn = new ButtonBuilder().setLabel("Source").setURL(sourceURL).setStyle("Link");

        prevBtn.disabled = true;
        const row = new ActionRowBuilder().addComponents(prevBtn, nextBtn, sourceBtn, closeBtn);

        await interaction.editReply({
          content: " ­",
          components: [row],
          embeds: [embed],
        });
        const message = await interaction.fetchReply();

        if (currInd >= productFound.length) return;

        const filter = (btn) => {
          return btn.user.id === interaction.user.id && btn.message.id == message.id;
        };

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 120000,
        });

        collector.on("collect", async (btn) => {
          const id = btn.customId;

          if (id === "stockx_next") {
            prevBtn.disabled = false;
            currInd++;
            productDetail = await stockx.fetchProductDetails(productFound[currInd].uuid);
            let sourceURL = `https://stockx.com/${productDetail.market.productUuid}`;

            let embed = await fetchDetails(productDetail, currInd);

            if (currInd == productFound.length - 1) {
              nextBtn.disabled = true;
            } else {
              nextBtn.disabled = false;
            }

            sourceBtn.setURL(sourceURL);
            const row = new ActionRowBuilder().setComponents(prevBtn, nextBtn, sourceBtn, closeBtn);
            await interaction.editReply({
              components: [row],
              embeds: [embed],
            });
          } else if (id === "stockx_prev") {
            nextBtn.disabled = false;
            currInd--;
            productDetail = await stockx.fetchProductDetails(productFound[currInd].uuid);
            let sourceURL = `https://stockx.com/${productDetail.market.productUuid}`;

            let embed = await fetchDetails(productDetail, currInd);

            if (currInd === 0) {
              prevBtn.disabled = true;
            }
            sourceBtn.setURL(sourceURL);
            const row = new ActionRowBuilder().setComponents(prevBtn, nextBtn, sourceBtn, closeBtn);

            await interaction.editReply({
              components: [row],
              embeds: [embed],
            });
          } else if (id === "stockx_close") {
            interaction.deleteReply(); // Delete bot embed
            db.delete(`${author.id}.stockxstarted`);
          }

          btn.deferUpdate();
        });
      });
    } catch (e) {
      console.log(e);
      db.delete(`${author.id}.stockxstarted`);
      interaction.editReply({ content: "Could not find a valid product.", ephemeral: true });
    }
  },
};
