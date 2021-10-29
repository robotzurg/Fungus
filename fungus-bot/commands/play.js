const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song from a youtube link!')
		.addStringOption(option => 
            option.setName('query')
                .setDescription('The song you want to play.')
                .setRequired(true)),
	async execute(interaction, client) {
        if (!interaction.member.voice.channelId) return await interaction.editReply({ content: "You are not in a voice channel!", ephemeral: true });
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.editReply({ content: "You are not in my voice channel!", ephemeral: true });
        const query = interaction.options.get("query").value;
        const queue = client.plr.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });
        
        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.editReply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        const track = await client.plr.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.editReply({ content: `❌ | Track **${query}** not found!` });

        queue.play(track);

        return await interaction.editReply({ content: `🎵 | Queueing track **${track.title}**!` });
	},
};