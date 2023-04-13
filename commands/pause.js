const {SlashCommandBuilder} = require("@discordjs/builders")
const{messageEmbed} = require("discord.js")
const {useMasterPlayer} = require("discord-player")
module.exports = {

    data: new SlashCommandBuilder()
    .setName( "pause")
    .setDescription('pauses the current song.')
    ,
    execute: async ({client,interaction}) => {
        const player = new useMasterPlayer()
        const queue = await player.nodes.create(interaction.guild);
        
        if (!queue.node.isPlaying()) {
            interaction.reply("theres nothing playing right now")
            return;
        }
        const currentsong = queue.currentTrack;

        queue.node.pause();

        await interaction.reply( {
            embeds: [
                new EmbedBuilder().
                setDescription(` Paused ${currentsong.title}  || c`)
                .setThumbnail(currentsong.thumbnail)
            ]
        })
           
            
        
    }

}
