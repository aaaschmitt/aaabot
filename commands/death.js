import { MessageActionRow, MessageButton } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('death')
    .setDescription('Create an interactive death counter! Darks Souls 3...')
    .addStringOption(option => option.setName('name').setDescription('Select the dead one\'s name.'))
    .addIntegerOption(option => option.setName('initial-count').setDescription('Number of deaths to start the count at (default is 0).'));
export const button = {
    customId: "death-button",
    async execute(interaction) {
        const content = interaction.message.content;
        const num_deaths_str = content.substring(content.indexOf(':') + 1);
        var num_deaths = parseInt(num_deaths_str);
        if (isNaN(num_deaths)) {
            throw "Failed to parse death button text: " + num_deaths_str;
        }
        num_deaths += 1;

        const name = content.substring(0, content.indexOf('\'s'));
        const button_row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('death-button')
                    .setLabel(name + " DIED")
                    .setStyle('DANGER')
            );

        interaction.update({ content: name + '\'s Death Count: ' + num_deaths, components: [button_row] });
    }
};
// Creates a message with a button containing the specified name.
export async function execute(interaction) {
    const name = interaction.options.getString('name');
    if (!name) {
        throw 'No name specified!';
    }
    var initial_count = interaction.options.getInteger('initial-count');
    if (!initial_count) {
        initial_count = 0;
    }
    const button_row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('death-button')
                .setLabel(name + " DIED")
                .setStyle('DANGER')
        );

    interaction.reply({ content: name + '\'s Death Count: ' + initial_count, components: [button_row] });
}