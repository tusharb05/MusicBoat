function info(player, message){
    console.log(player.nowPlaying(message).title)
            let time = player.nowPlaying(message).durationMS / 1000
            let embed = new MessageEmbed()
                .setTitle('Now Playing: ' + player.nowPlaying(message).title)
                .setURL(player.nowPlaying(message).url)
                .setColor('#511281')
                .setThumbnail(player.nowPlaying(message).thumbnail)
                .addFields(
                    {name: "Artist", value: player.nowPlaying(message).author, inline: false},
                    {name: "Source", value: player.nowPlaying(message).source, inline: false},
                    {name: "Requested By", value: player.nowPlaying(message).requestedBy, inline: false},
                    {name: "Views", value: player.nowPlaying(message).views, inline: false},
                    {name: "Duration", value: time.toString() + ' seconds', inline: false}
                )
            message.channel.send(embed)
}

module.exports = info;