const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses playback.'),
	async execute(interaction, client) {
		const queue = client.plr.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.editReply({ content: "❌ | No music is being played!" });

        const paused = queue.setPaused(true);
        return void interaction.editReply({ content: paused ? "⏸ | Paused!" : "❌ | Something went wrong!" });
	},
};
