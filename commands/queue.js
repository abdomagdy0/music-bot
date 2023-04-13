const {SlashCommandBuilder} = require("@discordjs/builders")
const{EmbedBuilder, Message} = require("discord.js")
const {queryType, useMasterPlayer} = require ("discord-player")
const { useQueue } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
    .setName( "queue")
    .setDescription('Show the first 10 songs in the queue')
   ,
   execute: async ({interaction, client}) => {
    const player = new useMasterPlayer()
    // const queue = await player.nodes.create(interaction.guild)

    // const tracks = queue.tracks;

    const queue = useQueue(interaction.guild.id);
    const tracks = queue.tracks.toArray();

    if (tracks.length === 0) {
        interaction.reply('The queue is currently empty.');
    } else {
        let message = 'Here are the songs in the queue:\n';
        tracks.forEach((track, index) => {
            
            message += `${index + 1}. ${track.title}\n`;
        });
        const embed = new EmbedBuilder().setDescription(message)
       await interaction.reply({embeds: [embed] });
    }

    
},


}
   
