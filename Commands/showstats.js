function stats(player, message, MessageEmbed){
    let stats = player.getStats();
    let embed = new MessageEmbed()
        .setTitle('Stats')
        .setColor('#233e8b')
        .addFields(
            {name: 'Uptime', value: (stats.uptime/1000).toString()+'s', inline: false},
            {name: 'Users', value: stats.users, inline: false},
            {name: 'No. of queues', value: stats.queues, inline: false}
        )
        .setThumbnail('https://www.maxpixel.net/static/photo/1x/Cd-Note-Sound-Song-Music-Disc-160112.png')
    message.channel.send(embed)
}

module.exports = stats;