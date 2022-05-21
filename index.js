//NerdBOT 977536503116873759
const discord = require('discord.js');
const fs = require('fs');
const bot = new discord.Client({
  presence: {
        status: 'online',
        afk: false,
        activities: [{
            name: "Rysiek",
            type: "LISTENING",
        }],
  },
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MEMBERS'
  ],
  partials: [
    'MESSAGE',
    'CHANNEL',
    'REACTION',
    'GUILD_MEMBER'
  ]
});

const eventDir = fs.readdirSync('./events').filter(eventFile => eventFile.endsWith('.js'));

for (const eventFile of eventDir) {
  const event = require(`./events/${eventFile}`);
  event.execute(bot);
}

bot.on('interactionCreate', interaction =>{
  const command = require(`./commands/${interaction.commandName}`);
  command.execute(interaction);
})




bot.login(process.env['token']);


// HTTP Server
const http = require('http');
http.createServer((req, res) => {
  res.write("OK");
  res.end();
}).listen(3000);