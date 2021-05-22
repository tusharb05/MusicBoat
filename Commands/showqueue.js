function showqueue(player, message){
    let allTracks = player.getQueue(message).tracks;
            allTracks.forEach((singleTrack)=>{
                let embed = new MessageEmbed()
                    .setTitle(singleTrack.title)
                    .setURL(singleTrack.url)
                    .addField('Duration', singleTrack.duration, true)
                    .setThumbnail(singleTrack.thumbnail)
                message.channel.send(embed)
            })
}

module.exports = showqueue;