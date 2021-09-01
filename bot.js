const {Client, MessageEmbed, VoiceChannel} = require('discord.js')
const client = new Client();
const {Player, Queue, Track} = require('discord-player');
const player = new Player(client);
const { Lyrics } = require("@discord-player/extractor");

client.player = player;
require('dotenv').config(); 

const paginationEmbed = require('./page');
const seek = require('./Commands/goto');

const PREFIX = 'm!';

const lyricsClient = Lyrics.init();

client.player.on("trackStart", (message, track) => {
    message.channel.send(`Now playing ${track.title}`)
})

const songs = [];

client.on('ready', ()=>console.log('logged in')); 


client.on('message', (message)=>{
    if(message.author.bot == true) return;
    if(message.content.startsWith(PREFIX)){
        const [cmd, ...args] = message.content 
            .trim() 
            .substring(PREFIX.length) 
            .split(/\s+/);
        if(cmd === "play"){
            try{
                player.stop(message);
                player.play(message, args.join(' '), true)
                songs.push(args.join(' '));
                // console.log(songs)
                // console.log(player.filters)
                
            } catch(NotPlaying){
                player.play(message, args.join(' '), true)
                songs.push(args.join(' '));
                // console.log(player.filters)
            }
        }else if(cmd === "stop"){
            try{
                player.stop(message);
            }catch(NotPlaying){
                message.channel.send('Nothing being played right now. Join a server and play a song first!')
            }
            
        }else if(cmd === "pause"){
            try{
                player.pause(message);
            }catch(NotPlaying){
                message.channel.send('Nothing being played right now. Join a server and play a song first!')
            }
            
        }else if(cmd === "resume"){
            try{
                player.resume(message);
            }catch(NotPlaying){
                message.channel.send('Nothing being played right now. Join a server and play a song first!')
            }
        }else if(cmd === "lyrics"){
            if(player.isPlaying(message)){
                
                lyricsClient.search(songs[songs.length-1])
                    .then(data => {
                        console.log(data)
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
            } else {
                message.channel.send('No song played currently.')
            }
        }else if(cmd === "info"){
            try{
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
            }catch(NotPlaying){
                message.channel.send('No song played currently.')
            }
            
        }else if(cmd === 'showbar'){
            try{
                message.channel.send(player.createProgressBar(message, {timecodes: true, queue: false}));
            }catch(NotPlaying){
                message.channel.send('No song played currently')
            }
            
        }else if(cmd === "addtoqueue"){
            if(args.length === 0) return message.channel.send('Please provide a name of a song.')
            player.play(message, args.join(' '), true)
            
        }else if(cmd === "showqueue"){
            
            // console.log(allTracks)
            if(player.getQueue(message)){
                let allTracks = player.getQueue(message).tracks;
                allTracks.forEach((singleTrack)=>{
                    let embed = new MessageEmbed()
                        .setTitle(singleTrack.title)
                        .setURL(singleTrack.url)
                        .addField('Duration', singleTrack.duration, true)
                        .setThumbnail(singleTrack.thumbnail)
                    message.channel.send(embed)
                })
            }else{
                message.channel.send('The queue is empty.')
            }
            
        }else if(cmd === "jump"){
            if(args.length == 0) return message.channel.send('Please provide a number to skip to.');
            player.clearQueue(message)
            // try{
            //     x
            // }catch{
            //     message.channel.send('Not playing any song currently.')
            // }
            
        }else if(cmd === "skip"){
            try{
                if(args.length > 0) return message.channel.send('bruh');
                let tracks = player.getQueue(message).tracks
                player.jump(message, tracks.length - (tracks.length-1));
                message.channel.send('Song skipped!')
            }catch{
                message.channel.send('No song played currently.')
            }
            
        }else if(cmd === "clearqueue"){
            try{
                player.clearQueue(message)
                message.channel.send('Queue cleared!')
            }catch{
                message.channel.send('asdf')
            }
            
        }else if(cmd === "timestamp"){
            try{
                let timestamp = require('./Commands/timestamp');
                timestamp(message, MessageEmbed, player);
            }catch(NotPlaying){
                message.channel.send('No music being played right now')
            }           
        }else if(cmd === "seek"){
            //timecode
            try{
                if(args.length == 0) return message.channel.send('Please provide a time code in seconds')
                let goto = require('./Commands/goto');
                goto(message, player, args[0])
                message.channel.send('Seeked time code: ' + args[0] + 's')
            }catch(NotPlaying){
                message.channel.send('No song played currently.')
            }
            
        }else if(cmd === "setvol"){
            let setvol = require('./Commands/setvolume')
            setvol(player, message, args[0])
            
        }else if(cmd === "shuffle"){
            player.shuffle(message)
        }else if(cmd === "showqueuebar"){
            message.channel.send(player.createProgressBar(message, {timecodes: true, queue: true}));
        }else if(cmd === "showstats"){
            const showstats = require('./Commands/showstats')
            showstats(player, message, MessageEmbed);
        }else if(cmd === "repeat"){
            player.setRepeatMode(message, true)
        }
    }
});


client.login(process.env.BOT_TOKEN);
