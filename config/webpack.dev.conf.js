const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MinicssExtractPlugin = require('mini-css-extract-plugin')
const Optimizecss = require('optimize-css-assets-webpack-plugin')
const glod = require('glob')
const PurifycssPlugin = require('purifycss-webpack')
const TerserPlugin = require('terser-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

let publicPath = 'http://localhost:3000/static/assets'

module.exports = {
  mode: 'development', // 开发模式

  entry: './src/index.js', // 打包后输出的文件名 为 main.js

  output: {
    path: path.resolve(__dirname, 'dist'), // 打包后项目 输出到项目根目录下 dist 文件夹
    filename: '[name].js' // 输出的 入口JS文件名称
  },

  optimization: {
    minimize: true, // 压缩
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      })
      // new Optimizecss({
      //   cssProcessorOptions: {
      //     map: {
      //       inline: false,
      //       annotation: true
      //     }
      //   }
      // })
    ]
  },

  // loader 相关配置
  module: {
    rules: [
      {
        test: /\.(htm|html)$/,
        use: [
          {
            loader: 'html-withimg-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ MinicssExtractPlugin.loader, 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [ MinicssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.less$/,
        use: [ MinicssExtractPlugin.loader, 'css-loader', 'less-loader' ]
      },
      {
        test: /\.js$/,
        use: [ 'babel-loader' ],
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 文件体积小于 8192kb 时，将被转为 base64 资源
              name: '[name].[ext]',
              outputPath: 'static/assets/',
              publicPath
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/assets/' // 资源 输出路径
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/assets/' // 资源 输出路径
            }
          }
        ]
      }
    ]
  },

  // 插件 相关配置
  plugins: [
    // new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),

    // 分离 css
    new MinicssExtractPlugin({
      filename: 'static/css/[name].[hash:7].css'
    }),

    // // 压缩分离后的 css
    // new Optimizecss(),

    // // 净化 css
    // new PurifycssPlugin({
    //   paths: glod.sync(path.join(__dirname, '../src/*.html'))
    // }),

    // // copy assets and manifest.json
    // new CopyWebpackPlugin([
    //   {
    //     from   : path.resolve(__dirname, '../src/assets'),
    //     to     : 'assets',
    //     ignore : ['.*', 'styles/*', 'fonts/*']
    //   },
    //   {
    //     from : path.resolve(__dirname, '../src/manifest.json'),
    //     to   : ''
    //   }
    // ]),

    new webpack.DefinePlugin({
      MODE: JSON.stringify('development')
    })
  ],

  // 本地开发
  devServer: {
    index: 'index.html', // 服务器启动的页面（同 html-webpack-plugin 中 filename 选项）; 默认值为 index.html
    host: 'localhost', // 指定host; 默认 localhost
    port: 3000, // 指定端口号; 默认 8080

    open: true, // 启动本地服务后，自动打开页面// 启动本地服务后，自动打开页面
    compress: true, // 是否启用 gzip 压缩
    overlay: true, // 编译器错误或警告时, 在浏览器中显示全屏覆盖; 默认false
    progress: true, // 是否将运行进度输出到控制台; 默认 false

    contentBase: path.resolve(__dirname, 'src'), // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要

    publicPath: '',

    // 精简 终端输出（本地运行时）
    stats: {
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }
  }
}
