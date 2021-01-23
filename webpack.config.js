//此处可以转化为ES6模块的代码 import path from 'path';
const path = require('path')
//引入copy-webpack-plugin插件
const copyWebpackPlugin = require('copy-webpack-plugin')
//引入清理文件插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
//Babel实例
const babel = require('@babel/core')
//less实例
const less = require('less')

module.exports = {
  mode: 'development', //编译模式设置为development 开发模式
  //watch: true,  //开启热更新监控模式
  entry: './src/app.js',
  output: {
    path: path.join(__dirname,'dist')
  },
  plugins: [
    new CleanWebpackPlugin(), //配置清空文件插件，只需要实例化就可完成清空任务
    new copyWebpackPlugin({patterns:[  //配置copy-webpack-plugin插件 ，构造函数的使用 官网标准用法
      {
          context: './src', //告诉插件该项目代码的根目录为src文件夹
          from: '**/*.js',   //将源代码下所有文件复制到输出目录 （使用babel时，只对js进行操作）
          to: './',
          //ignore: ['*.test.js','*.spec.js'], //忽略这些js，不编译 此属性已经废弃
          //最新版本写法
          globOptions: {
            ignore: [
                '**/*.test.js*' // ** 两个星号的意思是在当前路径
            ]
          },
          transform(content,path){
              // transform origin code to ES 5 code
              const newCode = babel.transformSync(content,{
                babelrc: true,
                "presets": ["@babel/env"]
              }).code
              return Promise.resolve(newCode.toString())
          }
      },{
        context: './src', 
        from: '**/*.less',
        to: '[path][name].wxss',  //导出的文件中添加随便数 [path][name].[contenthash].[ext]   文件名：test.a3412d2a8e5a0f5ec4649db4ee6f3cd0.less
                                                //contenthash是针对文件内容级别的，只有你自己模块的内容变了，那么hash值才改变
        transform(content, path) {
          return less.render(content.toString())
            .then(function (output) {
              return output.css;
            });
        }
      },{
        context: './src',
        from: '**/*.wxss',
        to: './'
      },{
        context: './src',
        from: '**/*.wxml',
        to: './'
      },{
        context: './src',
        from: '**/*.json',
        to: './'
      },{
        context: './src',
        from: '**/*.jpg',
        to: './'
      },{
        context: './src',
        from: '**/*.png',
        to: './'
      }
    ]
  })
  ]
}
