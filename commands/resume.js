const {SlashCommandBuilder} = require("@discordjs/builders")
const{EmbedBuilder} = require("discord.js")

const {useMasterPlayer} = require("discord-player")
module.exports = {

    data: new SlashCommandBuilder()
    .setName( "resume")
    .setDescription('resumes the current song.')
    ,
    execute: async ({client,interaction}) => {
        
        const player = new useMasterPlayer();

        

        // Make sure the user is inside a voice channel
		if (!channel) return interaction.reply("You need to be in a voice channel first");

        // Create a play queue for the server
        const queue = await player.nodes.create(interaction.guild);



        if (!queue.node.isPlaying()) {

            interaction.reply("theres nothing playing right now")
            return;
        }
        const currentsong = queue.current;

        queue.node.resume();   

        await interaction.reply( {
            embeds: [
                new EmbedBuilder().
                setDescription(`resumed  ${currentsong.title} ->`)
                .setThumbnail(currentsong.thumbnail)
            ]
        })
            
        
    }

}
