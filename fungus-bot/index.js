// require the discord.js module
const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Player } = require("discord-player");

// create a new Discord client and give it some variables
const { Client, Intents } = require('discord.js');
const myIntents = new Intents();
myIntents.add('GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_PRESENCES');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
                            Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES ], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
const registerCommands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const player = new Player(client, {
    ytdlOptions: {
	quality: "highestaudio",
	highWaterMark: 1 << 25,
    },
});

client.plr = player;

client.plr.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`))

// Place your client and guild ids here
const clientId = '902832747368833025';
const guildId = '845890540486787084';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    if (command.type === undefined) {
        // Slash Commands
        client.commands.set(command.data.name, command);
        registerCommands.push(command.data.toJSON());
    } else {
        // Context Menu Commands (these have a different structure)
        client.commands.set(command.name, command);
        registerCommands.push(command);
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: registerCommands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.once('ready', async () => {
    console.log('Ready!');
    const date = new Date().toLocaleTimeString().replace("/.*(d{2}:d{2}:d{2}).*/", "$1");
    console.log(date);
});

// Listen for interactions (INTERACTION COMMAND HANDLER)
client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand() && !interaction.isContextMenu()) return;

	await interaction.deferReply();

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    if (command.admin === true) {
        if (interaction.user.id != '497567854884028446' || interaction.user.id === '122568101995872256' || interaction.user.id === '775221726564450324') {
            try {
                await command.execute(interaction, client);
            } catch (error) {
                await console.error(error);
                await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else {
            await interaction.editReply('This command is an admin command, therefore you can\'t use it!')
        }
    } else {
        try {
            await command.execute(interaction, client);
        } catch (error) {
            await console.error(error);
            await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
    
});

let count = 0;

// Listen for messages
client.on('messageCreate', async message => {
    count += 1
    if (count === 5) {
	message.react('<:balls:894382977772044318>');
	count = 0;
    }
});

player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.on("channelEmpty", (queue) => {
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

// login to Discord
client.login(token);
