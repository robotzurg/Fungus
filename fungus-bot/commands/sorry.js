const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mommy')
		.setDescription('Replies with Sorry!'),
	async execute(interaction) {
		interaction.editReply('Sorry!');
	},
};
