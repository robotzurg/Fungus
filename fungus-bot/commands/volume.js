const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Check or change the volume of the bot! [ADMIN ONLY]')
        .addIntegerOption(option => 
            option.setName('volume')
                .setDescription('The new volume for the bot.')
                .setRequired(false)),
    admin: true,
	async execute(interaction, client) {
        const queue = client.plr.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.editReply({ content: "❌ | No music is being played!" });
        const vol = interaction.options.getInteger("volume");

        if (!vol) return void interaction.editReply({ content: `🎧 | Current volume is **${queue.volume}**%!` });
        if ((vol) < 0 || (vol) > 100) return void interaction.editReply({ content: "❌ | Volume range must be 0-100" });
        const success = queue.setVolume(vol);

        return void interaction.editReply({
            content: success ? `✅ | Volume set to **${vol}%**!` : "❌ | Something went wrong!"
        });
	},
};


