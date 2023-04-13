const {SlashCommandBuilder} = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const { useMasterPlayer } = require( 'discord-player');
module.exports = {

    data: new SlashCommandBuilder()
    .setName( "skip")
    .setDescription('skips the current song.')
    ,
    execute: async ({client,interaction}) => {
        const player = new useMasterPlayer()
        const queue = await player.nodes.create(interaction.guild);

        if (!queue.node.isPlaying()) {
            interaction.reply("theres nothing playing right now")
            return;
        }
        const currentsong = queue.currentTrack
        

        queue.node.skip();
        

        

        await interaction.reply( {
            embeds: [
                new EmbedBuilder().
                setDescription(`skipped ->> ${currentsong.title} <<-`)
                .setThumbnail(currentsong.thumbnail)
            ]
        })
    }

}
