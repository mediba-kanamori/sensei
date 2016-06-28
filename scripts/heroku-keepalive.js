module.exports = class HerokuKeepalive {
  static run(controller) {
    controller.webserver.get('/heroku/keepalive', (req, res) => {
      res.send('OK');
    });
  }
};
