const path = require("path");
const fs = require('fs');
const webpack = require('webpack');

const HtmlwebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const isDevServer = process.env.WEBPACK_SERVE;   // if in dev-server mode
const localPort = 8081;
const localUrl = `http://localhost:${localPort}`;
const remoteUrl = 'https://testing-assets.openfin.co/reverseiframe';
let   preloadUrl = `http://localhost:${localPort}`;

let definePlugin, rootUrl;

const copyPlugin = new CopyPlugin({
    patterns: [
      { from: path.join(__dirname, 'res', 'app.json'), to: path.join(__dirname, 'dist'),
        transform(content, absoluteFrom) {
            return content.toString().replaceAll('{APP_ROOT_URL}', rootUrl) ;
        },    
      }
    ],
});

module.exports = (env) => {
    console.log(env.mode);
    if (!isDevServer && env.mode === 'production') {
        rootUrl = remoteUrl;
        preloadUrl = remoteUrl;
        definePlugin = new webpack.DefinePlugin({
            APP_ROOT_URL: JSON.stringify(remoteUrl),
            APP_PRELOAD_URL: JSON.stringify(remoteUrl)
        });
    } else {
        rootUrl = localUrl;
        definePlugin = new webpack.DefinePlugin({
            APP_ROOT_URL: JSON.stringify(localUrl),
            APP_PRELOAD_URL: JSON.stringify(localUrl)
        });
    }
    
   return {
    mode: env.mode,
    entry: {
        index: './src/index.ts',
        apiframe: './src/apiframe.ts',
        preload: './src/preload.ts',
        sharedWorker: './src/sharedWorker.ts'
    },
    devtool: env.mode === 'development' ? 'source-map' : undefined,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-bundle.js',
        publicPath: ''  // workaround for some weird issue with webpack
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [ "style-loader", "css-loader"],
            }            
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js', '.tsx' ],
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: 'REVERSE IFRAME TEST',
            template: 'res/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlwebpackPlugin({
            title: 'REVERSE IFRAME',
            template: 'res/apiframe.html',
            filename: 'apiframe.html',
            chunks: ['apiframe']
        }),
        definePlugin
    ],
    devServer: {
        static : [
            { directory : path.join(__dirname, 'res')},
            { directory : path.join(__dirname, 'dist')}
        ],
        port: localPort,
        hot: true,
        setupMiddlewares: (middlewares, devServer) => {
            devServer.app.get('/app.json', (request, response) => {
                const data = fs.readFileSync(path.join(__dirname, 'res', 'app.json'), {encoding:'utf8', flag:'r'});
                const manifest = JSON.parse(data.replaceAll('{APP_ROOT_URL}', rootUrl).replaceAll('{APP_PRELOAD_URL}', preloadUrl) );
                manifest.startup_app.uuid = `reverse-iframe-${Math.round(Math.random() * 10000)}`;
                if (request.query.app) {
                    manifest.startup_app.url = `https://${request.query.app}`;
                }
                response.send(JSON.stringify(manifest));
            });
            return middlewares;
        }
    }
 }
};