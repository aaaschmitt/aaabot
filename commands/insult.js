import fetch from 'node-fetch';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('insult')
	.setDescription('Be very rude to someone!')
	.addStringOption(option => option.setName('user').setDescription('Select a user'));

export async function execute(interaction) {
	const user = interaction.options.getString('user');
	const response = await fetch("https://insult.mattbas.org/api/insult?who=" + user);
	const body = await response.text();
	await interaction.reply(body);
}