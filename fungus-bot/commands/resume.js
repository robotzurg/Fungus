const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume the song if it has been paused!'),
	async execute(interaction, client) {
        const queue = client.plr.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.editReply({ content: "❌ | No music is being played!" });

        const paused = queue.setPaused(false);
        return void interaction.editReply({ content: !paused ? "❌ | Something went wrong!" : "▶ | Resumed!" });
	},
};

