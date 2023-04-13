
const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const { useMasterPlayer } = require( 'discord-player');
module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play a song from YouTube.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Search for a song on youtube")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("search keywords").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("playlist")
				.setDescription("Plays a playlist from Youtube")
				.addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("song")
				.setDescription("Plays a single song from Youtube")
				.addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
        const player = new useMasterPlayer();

        const channel = interaction.member.voice.channel;

        // Make sure the user is inside a voice channel
		if (!channel) return interaction.reply("You need to be in a Voice Channel to play a song.");

        // Create a play queue for the server
        const queue = await player.nodes.create(interaction.guild);

        // Wait until you are connected to the channel
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()

		if (interaction.options.getSubcommand() === "song") {


            let url = interaction.options.getString("url")
            
            // Search for the song using the discord-player

            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            

            if (result.tracks.length === 0)
            return interaction.editReply("No results")
        
        // Add the track to the queue
        const song = result.tracks[0]
        await queue.addTrack(song)
        embed
            .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}`})


            await interaction.deferReply({
                embeds: [embed]
            })
		}

        
        else if (interaction.options.getSubcommand() === "search") {

        
            // Search for the song using the discord-player
            let url = interaction.options.getString("searchterms")
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            await interaction.deferReply();


            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            // Add the track to the queue
            const song = result.tracks[0]
           
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
                await interaction.editReply({
                    embeds: [embed]
                })
		}

        else if (interaction.options.getSubcommand() === "playlist") {

            // Search for the playlist using the discord-player
            let url = interaction.options.getString("url")

            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            

            if (result.tracks.length === 0)
                return interaction.reply(`No playlists found with ${url}`)
            
            // Add the tracks to the queue
            const playlist = result.tracks
            
            await queue.addTrack(playlist)
            embed.setDescription("playlist has been added to the queue")
                .setThumbnail(` ${playlist.thumbnail}`)
                await interaction.editReply({
                    embeds: [embed]
                })
    
		} 

        // Play the song
        if (!queue.node.isPlaying()) await queue.node.play()

        await interaction.editReply({
            embeds: [embed]
        })
        // Respond with the embed containing information about the player
        
	},}