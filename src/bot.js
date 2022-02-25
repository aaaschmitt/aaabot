const Eris = require("eris");

const bot = new Eris(process.env.BOT_TOKEN);
bot.on("ready", () => {
  console.log("Ready!");
});
bot.on("messageCreate", (msg) => {
  if(msg.content === "!ping") {
    bot.createMessage(msg.channel.id, "Pong!");
  }
});
bot.connect();