// Require the necessary discord.js classes
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';

const clientId = process.env.CLIENT_ID,
    guildId = process.env.GUILD_ID,
    token = process.env.BOT_TOKEN;


// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

client.commands = new Collection();
client.buttons = new Collection();
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

var command_data = [];
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
    command_data.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
    if (command.button) {
        client.buttons.set(command.button.customId, command.button);
    }
}

// NOTE: During development you might want to comment this out if not needed.
// Register the application commands with Discord once on startup.
try {
    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: command_data });
    console.log('Successfully registered application commands.');
} catch (error) {
    throw 'Failed to deploy application commands on startup: ' + error;
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
    try {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            await command.execute(interaction);
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return;
            await button.execute(interaction);
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command: ' + error, ephemeral: true });
    }
});

// Login to Discord with your client's token.
client.login(token);