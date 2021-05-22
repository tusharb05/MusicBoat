function setvol(player, message, number){
    let num = parseFloat(number)
    if(num && num>=0 && num<101){
        console.log('hello')
        player.setVolume(message, num)
        message.channel.send('Volume set to ' + number)
    }else{
        message.channel.send('Enter a valid number between 0 and 100')
    }
    
}

module.exports = setvol;