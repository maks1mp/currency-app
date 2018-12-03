import express from 'express';
import qs from 'qs';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';
import API from '../common/api';
import initialState from '../common/reducers/initial';
import {DAYS_QUANTITY} from '../common/utils';
import path from 'path';

const dev_mode = process.env.NODE_ENV === 'development';

const app = new express();
const port = +process.env.PORT || 3000;

if (!dev_mode) {
    app.use('/dist', express.static(path.resolve(__dirname, '../dist')));
} else {
    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
}

const handleRender = (req, res) => {
    const params = qs.parse(req.query);
    let {currency = initialState.currency, value = initialState.value} = params;

    currency = currency.toUpperCase();
    value = parseFloat(value);

    if (isNaN(value)) {
        value = initialState.value;
    }

    Promise.all([
            API.fetchList(),
            currency ?
            API.fetchCurrencyForPreviosDays(currency, DAYS_QUANTITY) :
            Promise.resolve([])
        ])
        .then(([list, exchangeData]) => {
            const store = configureStore(Object.assign(
                JSON.parse(JSON.stringify(initialState)),
                {
                    list,
                    value,
                    currency: list.includes(currency) ? currency : '',
                    exchangeData
                }
            ));

            const html = renderToString(
                <Provider store={store}>
                    <App/>
                </Provider>
            );

            res.send(renderFullPage(html, store.getState()));
        })
        .catch(e => console.log(e) || res.send(renderErrorPage()));
}

app.use(handleRender);

const htmlWrapper = content => {
    return `
        <!doctype html>
        <html>
        <head>
            <title>Currency calculator</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
        </head>
        <body>
            ${content}
        </body>
        </html>
    `
}

const renderFullPage = (html, preloadedState) => {
    return  htmlWrapper(`
    <div id="app">${html}</div>
        <script>
          window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')};
        </script>
        <script src="${dev_mode ? '/static/bundle.js' : '/dist/bundle.js'}"></script>
    `);
};

const renderErrorPage = () => {
    return htmlWrapper(`
        <div id="#error">
            <h1 style="text-align: center; font-family: monospace;">
                Service currently not available
                <br>
                Try again later
            </h1>
        </div>
    `)
}

app.listen(port, (error) => {
    if (error) {
        console.error(error)
    } else {
        console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
    }
});