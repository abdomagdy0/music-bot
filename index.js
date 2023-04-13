require("dotenv").config()
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9")
const { Player } = require("discord-player")
const {Client,IntentsBitField, Collection} = require("discord.js")
const client = new Client( { 
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ],
})


//register commands
const fs = require("fs")
const path = require("path")

const commands = [];
client.commands = new Collection()

const commandsPath = path.join(__dirname,"commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));

for(const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Add the player on the client

const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.channel.send(`Started playing **${track.title}**!`);
});

client.on("ready", () => {
    // Get all ids of the servers
    const guild_ids = client.guilds.cache.map(guild => guild.id);


    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), 
            {body: commands})
        .then(() => console.log('Successfully updated commands for guild ' + guildId))
        .catch(console.error);
    }
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(error)
    {
        console.error(error);
      
    }
});

client.login(process.env.TOKEN);