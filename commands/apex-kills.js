import fetch from 'node-fetch';
import { SlashCommandBuilder } from 'discord.js';
import * as Metadata from '../metadata/metadata.js';

const trackerNetworkApiKey = process.env.TRN_API_KEY;

function getKillCountForLegend(legend, segments) {
	console.log("LEGEND: " + legend);
	for (const s of segments) {
		console.log(s);
		if (s?.type === "legend" && s?.metadata?.name?.toUpperCase() === legend.toUpperCase()) {
			let count = s?.stats?.kills?.value;
			return count ? count : 0;
		}
	}
	return 0;
}

function getTotalKillCount(segments) {
	for (const s of segments) {
		if (s?.type === "overview") {
			let count = s?.stats?.kills?.value;
			return count ? count : 0;
		}
	}
	return 0;
}

// See account types: https://tracker.gg/developers/docs/titles/apex
function getApiAccountType(account_type) {
	switch (account_type) {
		case "xbox": return "xbl";
		case "origin": return "origin";
	}
	return null;
}

export const data = new SlashCommandBuilder()
	.setName('apexkills')
	.setDescription('Get Apex kill counts for our friends!')
	.addStringOption(option => option.setName('legend').setDescription('Filter to only kills using a specific legend'))
	.addUserOption(option => option.setName('user').setDescription('Show kill counts for a Discord user broken down by legened.'))
	.addStringOption(option => option.setName('name').setDescription('Show kill counts for a user by name e.g. "Andy".'));

export async function execute(interaction) {
	const legend = interaction.options.getString('legend');
	const user_option = interaction.options.getUser('user');
	const name_option = interaction.options.getString('name');

	if (user_option && name_option) {
		throw 'Please specify only `user` or `name` not both.';
	}

	console.log(user_option);

	let user_info = user_option ? Metadata.findUserByDiscordUsername(user_option.username) : Metadata.findUserByRealName(name_option);

	if (!user_info) {
		throw 'Could not find a user matching the supplied options';
	}

	let account_info = Metadata.getAccountInfoForGame(user_info, "apex");
	if (!account_info) {
		throw `Could not find an account type to use for user: ${username}`;
	}

	let api_account_type = getApiAccountType(account_info.type);

	const response = await fetch(`https://public-api.tracker.gg/v2/apex/standard/profile/${api_account_type}/${account_info.username}`, {
		headers: { 'TRN-Api-Key': trackerNetworkApiKey }
	});
	const json = await response.json();

	let segments = json?.data?.segments;
	if (!segments) {
		throw `No data returned from API`;
	}

	let kill_count = legend ? getKillCountForLegend(legend, segments) : getTotalKillCount(segments);

	await interaction.reply(`${user_info.real_name} has ${kill_count} kills ` + (legend ? `with ${legend}` : "total"));
}