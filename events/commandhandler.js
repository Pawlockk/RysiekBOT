const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = {};
const commandDir = fs.readdirSync('./commands').filter(commandFile => commandFile.endsWith('.js'));

for (const commandFile of commandDir) {
  const commandName = `${commandFile}`.replace('.js', '');
  const command = require(`../commands/${commandFile}`);
  commands[commandName] = command.data.toJSON();
}



module.exports = {
  execute(bot) {
    bot.db = require("quick.db");
    bot.request = new (require("rss-parser"))();
        // YT notification TEST
    async function handleUploads() {
          if (await bot.db.fetch(`postedVideos`) === null) await bot.db.set(`postedVideos`, []);
          setInterval(async () => {
              await bot.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=UCtSwlnk8QAWY2tqgpYLHwcg`)
              .then(async data => {
                  if (bot.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
                  else {
                      await bot.db.set(`videoData`, data.items[0]);
                      await bot.db.push("postedVideos", data.items[0].link);
                      let parsed = await bot.db.fetch(`videoData`);
                      let channel = await bot.channels.fetch('676382885652987904');
                      if (!channel) return;
                      let message = `Hej @everyone, **Rysiek** właśnie wrzucił filmik!\n!\n${parsed.link}`
                      channel.send(message);
                    console.log(data.items[0]);
                  }
              });
          }, 30000);
      }
    bot.on('ready', async () => {
        const rest = new REST({ version: '9' }).setToken(process.env['token']);
      for (const guild of bot.guilds.cache) {
        await rest.put(Routes.applicationGuildCommands(bot.user.id, guild[0]), {body: Object.values(commands)});
      }
      console.log(bot.user.username, bot.user.id);
      handleUploads();
    })
  }
}
