const paginationEmbed = async (message, pages, emojiList = ['⏪', '⏩'], timeout = 120000) => {
    if (!message && !message.channel) throw new Error('Channel is inaccessible.');
    var fixf = pages[0].footer ? pages[0].footer : null;
    if (!pages) throw new Error('Pages are not given.');
    if (emojiList.length !== 2) throw new Error('Need two emojis.');
    let page = 0;
    const curPage = await message.channel.send(pages[page].setFooter(`${(fixf ? (fixf.text + " | ") : "")}Page ${page + 1} / ${pages.length}`, fixf ? fixf.iconURL : null),null,message);
    for (const emoji of emojiList) await curPage.react(emoji);
    const reactionCollector = curPage.createReactionCollector(
        (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot && user.id === message.author.id,
        { time: timeout }
    );
    reactionCollector.on('collect', reaction => {
        switch (reaction.emoji.name) {
            case emojiList[0]:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case emojiList[1]:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
        }
        curPage.edit(pages[page].setFooter(`${fixf ? fixf.text + " | " : ""}Page ${page + 1} / ${pages.length}`, fixf ? fixf.iconURL : null))
    });
    reactionCollector.on('end', () => {
    });
    return curPage;
};
module.exports = paginationEmbed;