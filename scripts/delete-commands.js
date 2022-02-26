// Deletes all the currently registered slash commands from a server
// (aka "guild") for a specific bot.
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const clientId =  process.env.CLIENT_ID,
      guildId = process.env.GUILD_ID,
      token = process.env.BOT_TOKEN;
    
const rest = new REST({ version: '9' }).setToken(token);
rest.get(Routes.applicationGuildCommands(clientId, guildId))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });