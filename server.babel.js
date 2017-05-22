import webpack from 'webpack'
import webpack_config from './webpack.config.babel'
import http from 'http'
import express from 'express'

let compiler = webpack(webpack_config),
    app = express()
    
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpack_config.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/public');
});
if (require.main === module) {
  var server = http.createServer(app);
  server.listen(process.env.PORT || 4444, function() {
    console.log("Listening on %j", server.address());
  });
}