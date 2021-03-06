const botkit = require('botkit');
const path = require('path');
const fs = require('fs');

const controller = global.controller = botkit.slackbot({
  debug: false,
});

controller.spawn({
  token: process.env.SLACK_BOT_TOKEN,
}).startRTM();

// keepaliveでpingを受けるためのサーバ
controller.setupWebserver(process.env.PORT || 8080);

const pluginsPath = path.resolve('.', 'scripts');
const plugins = fs.readdirSync(pluginsPath).sort();

const helps = plugins.map((file) => {
  const ext = path.extname(file);
  const pluginPath = path.join(pluginsPath, path.basename(file, ext));
  controller.log.info(`** Loading script: ${pluginPath}`);

  const plugin = new (require(pluginPath)); // eslint-disable-line global-require
  plugin.run(controller);

  return plugin.help ? plugin.help.join('\n') : '';
});

controller.hears(['help ?(.*)'], ['direct_message', 'direct_mention'],
  (bot, msg) => {
    bot.startTyping(msg);

    const regex = RegExp(msg.match[1], 'gi');
    const results = helps.filter((help) => {
      const conditions = help && help.search(regex) !== -1;
      return conditions;
    });

    bot.reply(msg, results.join('\n'));
  });
