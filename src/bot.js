// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on("interactionCreate", (interaction) => {
    if (!interaction.isMessageComponent()) return;
    
    const msg_text = interaction.message().content();

    if (msg_text === '!ping') {
        await interaction.reply('Pong!');
    } else if (msg_text == 'andy') {
        await interaction.reply('Stop writing code and go to bed!');
    }
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);