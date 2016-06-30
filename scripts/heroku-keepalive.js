module.exports = class HerokuKeepalive {
  run(controller) {
    controller.webserver.get('/heroku/keepalive', (req, res) => {
      res.send('OK');
    });
  }
};
