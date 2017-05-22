import path from 'path'
import glob from 'glob'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import k_qiniu from 'k-qiniu'
import webpack_config_data from './Create_Webpack_Config_Data'
import CONFIG from './CONFIG'
import env from './.env.js'
import _package from './package'

let __DEV__ = process.env.NODE_ENV !== 'production',
    __SERVER__ = process.env.NODE_ENV === 'SERVER',
    public_path,
    entries = (new webpack_config_data()).get_entry_js('./Src')

if ( !__DEV__ && CONFIG.k_cli.qiniu_url && CONFIG.k_cli.qiniu_url !== '' ) {
  public_path =  CONFIG.k_cli.qiniu_url + '/static/' + _package.name + "/" + _package.version +"/"
}else{
  public_path = CONFIG.k_cli.public_path
}

if (__SERVER__){
  entries[ 'index' ] = ['webpack-hot-middleware/client', entries[ 'index' ]] 

}
//entries[ 'k_cli_lib' ] = ['webpack-hot-middleware/client', entries[ 'k_cli_lib' ]] 

var chunks = Object.keys(entries);
var config = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: public_path,
    filename: 'js/[name].js?[chunkhash]',
    //chunkFilename: 'js/[id].chunk.js?[chunkhash]'
  },
  module: {
    preLoaders: [
        {
            test: /\.js$/,
            loader: 'eslint-loader',
            include: __dirname+ '/Src',
            //exclude: __dirname+ '/Src/Utils'
        }
    ],
    loaders: [ //加载器
      {
        test: /\.js$/,
        loaders: ['es3ify','babel']
      },
      {
        test: /\.scss$/,
        //loaders: ['style','css']
        //loaders: ['style','css','sass']
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },{
        test: /\.css$/,
        //loaders: ['style','css']
        loader: ExtractTextPlugin.extract('style', 'css','sass')
      }, {
        test: /\.(html|tpl)$/,
        loader: 'html?minimize=false'
        //loader: "html?-minimize" //避免压缩html,https://github.com/webpack/html-loader/issues/50
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]?[contenthash]'
      }, {
        test: /\.(png|jpe?g|gif)$/,
        //loader: 'url-loader?limit=819'
        loader: 'url-loader?limit=819&name=images/[name].[ext]?[contenthash]'
      }, {
        test: /\.(mp4|swf)$/,
        loader: 'file?name=video/[name].[ext]?[contenthash]'
      }
    ],
     /*postLoaders: [
          { test: /\.js$/, loader: 'es3ify' }
        ]*/
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'k_cli_lib', // 将公共模块提取，生成名为`lib`的chunk
      chunks: chunks,
      //minChunks: chunks.length // 提取所有entry共同依赖的模块
    }),
    new ExtractTextPlugin('css/[name].css?[contenthash]'), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
   __DEV__ ? () => {} : new webpack.optimize.UglifyJsPlugin({ //压缩代码
      compress: {
        warnings: false,
        screw_ie8: false

      }, 
      mangle: false,
            output: { screw_ie8: false },
      //except: ['$super', '$', 'exports', 'require'] //排除关键字
    }),
   __DEV__ ? () => {} : new k_qiniu({

      // 七牛云的两对密匙 Access Key & Secret Key
      accessKey: env.qiniu_access_key,
    
      secretKey: env.qiniu_secret_key,
    
      // 七牛云存储空间名称
      bucket: 'publish',
      
      // 上传到七牛后保存的文件名
      path: 'static/[name]/[version]/[asset]'

    }),
   __SERVER__ ? new webpack.HotModuleReplacementPlugin() : () => {}

  ]
};

 (new webpack_config_data()).get_entry_html('./Src').forEach(element => {
    config.plugins.push(new HtmlWebpackPlugin(element));
 })

  //console.log(JSON.stringify(config, null, 4))

 
 module.exports = config;