// Require the necessary discord.js classes
const { Client, MessageActionRow, MessageButton } = require('discord.js');
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
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    } else if (message.content === '!andy') {
        message.channel.send('Stop writing code and go to bed!');
    } else if (message.content.startsWith("!death-button")) {
        const command_parts = message.content.split(/\s+/);
        if (command_parts.length != 2) {
            message.reply("Bad usage. Expected: !death-button <name>");
            return;
        }
        const name = command_parts[1];
        const button_row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('death-button')
					.setLabel(name + " DIED")
					.setStyle('DANGER'),
			);
        
        message.reply({ content: name + '\'s Death Count: 0', components: [button_row] });
    }
});

client.on('interactionCreate', interaction => {
    console.log("interactionCreate: ", interaction);
	if (interaction.isButton() && interaction.customId === "death-button") {
        console.log("Got button interaction:", interaction);
        const content =  interaction.message.content;
        const num_deaths = parseInt(content.substring(content.indexOf(':')));
        if (isNaN(num_deaths)) {
            console.log("Failed to parse death button text: ", interaction);
            return;
        }

        const name = content.substring(0, content.indexOf('\'s'));
        const button_row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('death-button')
					.setLabel(name + " DIED")
					.setStyle('DANGER'),
			);

        interaction.update({ content: name + '\'s Death Count: ' + num_deaths, components: [button_row] })
    }
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);