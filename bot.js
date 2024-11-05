// Load libraries
const Eris = require("eris");
const MessageEmbed = require("davie-eris-embed");
const { QuickDB } = require("quick.db");

// Load database
const db = new QuickDB({ filePath: "db.sqlite" });

// Initialize bot
const bot = new Eris.CommandClient("Bot " + require("./token.json").token, {
	intents: [
		"guilds",
		"guildMessages"
	]
}, {
	defaultHelpCommand: false,
    prefix: "!"
});

// Run when bot is ready
bot.on("ready", async () => {
    console.log("Bot is now online.");
		bot.editStatus('online',{
		type: 0,
		name: `Eris Boilerplate by @ItsMeWillyV | !help`
	});
});

// Log errors instead of crashing
bot.on("error", (err) => {
    console.error(err);
});

// On message sent
bot.on("messageCreate", async (msg) => {
	
	// Check if sender is a bot
	if(msg.author.bot !== false) return;
	
	// Check if the user has any data
	if (!await db.get(`users.${msg.author.id}`)) {
		
		// Initialize player data
		await db.set(`users.${msg.author.id}`, {});
	};

    // Probably do something else
});

// Ping command
bot.registerCommand("ping", (msg) => {
	
	// Send message
	msg.channel.createMessage(
		new MessageEmbed()
		.setColor('#a0ff9c')
		.setAuthor(`${msg.author.username}`)
		.setThumbnail(`https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`)
		.setDescription('Pong!')
		.setFooter("What else were you expecting?").create
	).catch(err => console.error(err));
}, {
    description: "Ping, pong... you know the drill by now.",
	caseInsensitive: true,
	usage: ""
});

// Help commend
bot.registerCommand("help", (msg, args) => {
	
	// Initialize variables
	let format = '';
	let cmds = [];
	
	// Check for arguments
	if (!args[0]){
		
		// Add each command to array
		for (command in bot.commands){
			if (command)
			cmds.push(`\n**${bot.prefix}${command}** - *${bot.commands[command].description}*`);
		}
		
		// Send message
		return msg.channel.createMessage(
			new MessageEmbed()
			.setColor('#a0ff9c')
			.setAuthor(`🗣️ Commands`)
			.setDescription(cmds.sort().join(''))
			.setFooter(`Type '${bot.prefix}help [command]' for usage.`).create
		).catch(err => console.error(err));
	}
	
	// Look for inputted command in command list
	for (command in bot.commands){
		if (args[0].toLowerCase() === command.toLowerCase()){
			format = `*${bot.commands[command].description}*\n Usage: .${command} ${bot.commands[command].usage}`;
			break;
		}
	}
	
	// Check if string is empty
	if (format == ''){
		return msg.channel.createMessage(
			new MessageEmbed()
			.setColor('#ff0000')
			.setAuthor(`Hmmm...`)
			.setDescription(`${args[0].toLowerCase()} doesn't seem to be an actual command.`)
			.setFooter(`Type '${bot.prefix}help [command]' for usage.`).create
		).catch(err => console.error(err));
	}
	
	// Send message
	return msg.channel.createMessage(
			new MessageEmbed()
			.setColor('#a0ff9c')
			.setAuthor(`-${args[0].toLowerCase()}`)
			.setDescription(format)
			.setFooter(`Type ${bot.prefix}help for more commands.`).create
		).catch(err => console.error(err));
	
}, {
    description: "Open the help menu.",
	caseInsensitive: true,
	usage: "[command]"
});

// Start bot
bot.connect();