import glob from 'glob'
import _ from 'underscore'
import path from 'path'
import fs from 'fs'
import CONFIG from './CONFIG'

let CHUNK_NAME_SEP = '___',
    DEFAULT_CONFIG = {
        src: './Src',
    },
    Create_Webpack_Config_Data = config => {}

Create_Webpack_Config_Data.prototype.get_entry_js = function(glob_path){
    let js_path = path.join( glob_path, 'Js' ),
        js_path_glob = path.join( js_path, '**/*.js' ) ,
        files = glob.sync( js_path_glob ),
        entry_js = _.chain(files)
            .filter(element => {
                console.log(path.join( './', element.replace(/js/ig,'') + 'html' ))
               return fs.existsSync(  path.join( './', element.replace(/js/ig,'') + 'html' )  ) ;
               // return fs.existsSync( './' +  )
            })
            .map(element => {
                return [
                   path.relative( js_path, element ).replace(path.sep, CHUNK_NAME_SEP).replace('.js','') 
                    ,  './' + element//path.join('./', element)
                ]
            })
            .object()
            .value();
    entry_js['k_cli_lib'] =  CONFIG.k_cli.lib
    return entry_js
}

Create_Webpack_Config_Data.prototype.get_entry_html = function(glob_path){
    let path_glob = path.join( glob_path, '**/*.html' ),
        files = glob.sync( path_glob );
    
    return _.chain(files)
            .map(element => {
                var chunk_name = path.relative( glob_path, element ).replace(path.sep, CHUNK_NAME_SEP).replace('.html',''),
                    chunks,
                    path_file = ''
                    //path_file = '../../../';
                
                if ( chunk_name === 'static___footer' || chunk_name === 'static___header' ) {
                    chunks = [ ];
                    path_file = '';
                }else {
                    chunks =  ['k_cli_lib', chunk_name]
                }
                return { 
                        filename: path_file + path.relative( glob_path, element ),
                        template: element,
                        inject: false,
                        minify: { //压缩HTML文件
                          removeComments: true, //移除HTML中的注释
                          collapseWhitespace: true //删除空白符与换行符
                        },
                        inject: 'body',
                        chunks: chunks,
                        hash: false
                     }
                
            })
            .value();

    
}

module.exports = Create_Webpack_Config_Data;