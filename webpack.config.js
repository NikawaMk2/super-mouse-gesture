import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';

const webpackConfigForDevelopment = {
    devtool: 'inline-source-map',
    mode: 'development',
    entry: {
        background: './src/js/background/background.ts',
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
        path: resolve(dirname(fileURLToPath(import.meta.url)), 'dist'),
    },
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
