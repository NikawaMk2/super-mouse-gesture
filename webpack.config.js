import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const _dirname = dirname(fileURLToPath(import.meta.url));

const webpackConfigForDevelopment = {
    devtool: 'inline-source-map',
    mode: 'development',
    entry: {
        background: './src/js/background/background.ts',
        handler: './src/js/content/handler.ts',
        options_page: './src/js/options/options.tsx',
    },
    module: {
        rules: [
        {
            exclude: /node_modules/,
            test: /\.tsx?$/,
            use: 'ts-loader',
        },
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ]
                }
            }
        },
        ],
    },
    optimization: {
        minimize: false,
        splitChunks: {
        cacheGroups: {
            vendors: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            },
        },

        chunks: 'async',
        minChunks: 1,
        minSize: 30000,
        name: false,
        },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    output: {
        filename: '[name].js',
        path: resolve(_dirname, 'dist'),
    },
    plugins: [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: join(_dirname, 'src', 'manifest.json'),
              to: join(_dirname, 'dist'),
            },
            {
              context: 'src/images',
              from: '**/*.png',
              to: join(_dirname, 'dist', 'images'),
            },
            {
              context: 'src/font',
              from: '**/*.*',
              to: join(_dirname, 'dist', 'font'),
            },
            {
              context: 'src/options_page',
              from: join('**', '*.*'),
              to: join(_dirname, 'dist', 'options_page'),
            },
          ],
        }),
    ],    
};

export default (_env, argv) => {
    if (argv.mode !== 'production') {
        return webpackConfigForDevelopment;
    }

    const webpackConfigForProduction = {
        ...baseWebpackConfig,
        mode: 'production',
    };

    webpackConfigForProduction.optimization.minimize = true;
    webpackConfigForProduction.optimization.minimizer = [
        new TerserPlugin({
            extractComments: 'all',
            terserOptions: {
                compress: {
                    drop_console: true,
                },
            },
        })
        ];

    return webpackConfigForProduction;
};
