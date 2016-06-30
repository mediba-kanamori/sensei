module.exports = class Ping {
  get help() {
    return [
      'ping - Reply with pong',
    ];
  }

  run(controller) {
    controller.hears('^ping$', ['ambient', 'direct_message'], (bot, msg) => {
      bot.reply(msg, 'PONG');
    });
  }
};
