const config = require('../config');
let storageChannels = []; // TODO Storageに移行する

module.exports = class GuardReadOnly {
  run(controller) {
    controller.on('direct_mention', (bot, msg) => {
      this.guard(bot, msg);
    });

    controller.on('mention', (bot, msg) => {
      this.guard(bot, msg);
    });

    controller.on('ambient', (bot, msg) => {
      this.guard(bot, msg);
    });
  }

  guard(bot, msg) {
    this.getChannels(bot).then(() => {
      const channelName = this.getChannelName(msg.channel);
      if (this.isReadonlyChannel(channelName)) {
        bot.reply(msg, 'Francis Baconは言いました、\n'
          + '> 人間の知識と力は一致する、というのも、原因を知らなければ、結果を生み出すこともできないからだ。\n'
          + 'と。:speak_no_evil:'
        );

        bot.api.reactions.add({
          name: 'anger',
          channel: msg.channel,
          timestamp: msg.ts,
        });
      }
    });
  }

  isReadonlyChannel(channelName) {
    const result = config.readonlyChannels.includes(channelName);
    return result;
  }

  getChannelName(channelId) {
    const targetChannel = storageChannels.find((channel) => {
      const conditions = channel.id === channelId;
      return conditions;
    });

    return targetChannel.name;
  }

  getChannels(bot) {
    if (storageChannels.length) {
      return Promise.resolve(storageChannels);
    }

    return new Promise((resolve, reject) => {
      bot.api.channels.list({
        exclude_archived: 1,
      },
      (err, res) => {
        if (err) reject(new Error(err));

        storageChannels = res.channels;
        resolve(storageChannels);
      });
    });
  }
};
