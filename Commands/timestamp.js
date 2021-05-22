// const { MessageEmbed } = require("discord.js");

function getTime(message, MessageEmbed, player){
    let title = player.nowPlaying(message).title;
    //try and catch NotPlaying
    let embed = new MessageEmbed()
        .setTitle(title)
        .setColor('#867ae9')
        .addFields(
            {name: "Current", value: player.getTimeCode(message).current, inline: true},
            {name: "Ends at", value: player.getTimeCode(message).end, inline: true}
        )
    message.channel.send(embed);
    console.log(player.getTimeCode(message));
}

module.exports = getTime;