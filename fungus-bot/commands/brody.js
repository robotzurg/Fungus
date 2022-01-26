const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('brody')
		.setDescription('Bully Brody!')
		.addBooleanOption(option => 
            option.setName('ping')
                .setDescription('Ping?')
                .setRequired(false)),
	async execute(interaction) {
		const ping = interaction.options.getBoolean('ping');
        const outputs = ['Brody is just like Quackity', 'Brody is a bitch', 'Brody looks like he can\'t swim',
                         'Brody likes it up the ass', 'Brody would fuck a pie like in the Hit Classic, American Pie', 
						 'Brody would experience sexual attraction to the easter bunny', 'Brody isnt an ass guy, or a tits guy, or a thigh guy. He is a furry guy.',
						 'Brody owes the person who pinged this 20 dollars', 'Brody watches anime porn', 'Brody is a giggler',
						 'Brody would trade his girlfriend for Ryan Reynolds. This isnt a bullying thing, its just true.', 
						 'Brody got an anus tattooed between his butt cheeks because he was born without one.', 'Brody is not Technoblade',
						 'Brody would stick a cactus up his ass if he was horny enough', 'Brody is just a little guy'];

        let random = outputs[Math.floor(Math.random() * outputs.length)];
		if (ping === true) random = random.replace('Brody', '<@450496000289669122>');
		interaction.editReply(random);
	},
};
