const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Disconnect the bot from the VC.'),
	async execute(interaction, client) {
        const queue = client.plr.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.editReply({ content: "❌ | No music is being played!" });
        
        queue.destroy();
        return void interaction.editReply({ content: "🛑 | Stopped the player!" });
	},
};

