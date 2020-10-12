const path = require("path");
const resolve = (dir) => path.join(__dirname, dir); //将文件组成绝对路径

module.exports = {
    pages: {
        login: {
            entry: 'src/login/main.ts',
            template: 'public/login.html'
        },
        index: {
            entry: 'src/main.ts',
            template: 'public/index.html',
        }
    },

    devServer: {
        port: 3000,
        open: true,
        proxy: {
            '/api/*': {
                target: 'https://platform.smm.cn',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },

    lintOnSave: false,

    css: {
        loaderOptions: {
          postcss: {
            plugins: [
              require('postcss-pxtorem')({
                rootValue: 16, // 换算的基数
                selectorBlackList: [], // 忽略转换正则匹配项
                propList: ['*'],
              }),
            ]
          }
        }
      },

    chainWebpack: config => {
        // 添加别名
        config.resolve.alias
            .set('@libs', resolve('src/lib'))
            .set('@login', resolve('src/login'))
            .set('@config', resolve('src/config'))

        // config.module
        //     .rule('scss')
        //     .oneOf('vue')
        //     .use('px2rem-loader')
        //     .loader('px2rem-loader')
        //     .before('postcss-loader') // this makes it work.
        //     .options({ remUnit: 75, remPrecision: 8 })
        //     .end()
    }
}