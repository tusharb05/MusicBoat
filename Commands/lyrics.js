function lyrics(player, message){
    if(player.isPlaying(message)){
        console.log(songs[songs.length-1]);
        lyricsClient.search(songs[songs.length-1])
            .then(data => {
                let a = data.lyrics
                var chunks = a.match(/(.|[\r\n]){1,800}/g);
                var embeds = []
                for (let i = 0; i < chunks.length; i++) {
                    var thisemb = new MessageEmbed()
                        .setTitle("Lyrics")
                        .setDescription(chunks[i])
                        .setColor('#511281')
                    embeds.push(thisemb);
                }
                paginationEmbed(message, embeds, ['⏪', '⏩'], 60000)
            })
            .catch(err => console.log(err))
}
}

module.exports = lyrics;
