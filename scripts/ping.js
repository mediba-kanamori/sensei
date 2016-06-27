module.exports = class Ping {
  static get help() {
    return [
      'ping - Reply with pong',
    ];
  }

  static run(controller) {
    controller.hears('^ping$', 'direct_message', (bot, msg) => {
      bot.reply(msg, 'PONG');
    });
  }
};
