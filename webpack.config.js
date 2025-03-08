import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';

const _dirname = dirname(fileURLToPath(import.meta.url));

const baseWebpackConfig = {
    devtool: 'inline-source-map',
    entry: {
        background: './src/js/background/background.ts',
        content_script: './src/js/content/content_script.ts',
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
    const mode = argv.mode;
    if (mode === 'development') {
        return createwebPackConfigForDevelopment(mode);
    } else if (mode === 'production'){
        return createwebPackConfigForProduction(mode);
    }else{
        return createwebPackConfigForDevelopment('development');
    }
};

function createwebPackConfigForDevelopment(mode) {
    const webpackConfigForDevelopment = {
        ...baseWebpackConfig,
        mode: mode,
    };
    webpackConfigForDevelopment.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': mode,
        })
    );

    return webpackConfigForDevelopment;
}

function createwebPackConfigForProduction(mode) {
    const webpackConfigForProduction = {
        ...baseWebpackConfig,
        mode: mode,
    };
    webpackConfigForProduction.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': mode,
        })
    );

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
}