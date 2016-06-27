const botkit = require('botkit');
const path = require('path');
const fs = require('fs');

const controller = global.controller = botkit.slackbot({
  debug: false,
});

controller.spawn({
  token: process.env.token,
}).startRTM();

const scriptDir = path.resolve('.', 'scripts');
const scripts = fs.readdirSync(scriptDir).sort();

scripts.forEach((file) => {
  const ext = path.extname(file);
  const filePath = path.join(scriptDir, path.basename(file, ext));
  controller.log.info(`** Loading script: ${filePath}`);

  const script = require(filePath); // eslint-disable-line global-require
  script.run(controller);
});
