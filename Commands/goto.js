function goto(message, player, time){
    let timetoseek = time * 1000 //if in secs
    player.seek(message, timetoseek);
}

module.exports = goto;