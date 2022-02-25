// Require the necessary discord.js classes
const { Client } = require('discord.js');
const { GatewayIntentBits } = require('discord-api-types/v10');

// Create a new client instance
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on("messageCreate", message => {
    console.log("Message received: ", message);

    if (message.content === '!ping') {
        message.channel.send('Pong!');
    } else if (message.content === '!andy') {
        message.channel.send('Stop writing code and go to bed!');
    }
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);