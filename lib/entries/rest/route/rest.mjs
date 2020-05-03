/**
 * This file is part of Univuc/UAG.
 *
 * Copyright (C) 2020 Univuc <potados99@gmail.com>
 *
 * Univuc/UAG is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Univuc/UAG is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import authenticateUser from '../middleware/auth';
import constructUrl from 'iab/lib/utils/url';
import * as proxy from 'http-proxy-middleware';

const {createProxyMiddleware} = proxy;

export default function registerProxy(app, definition) {
    const options = getProxyOptions(definition);
    const proxy = createProxyMiddleware(definition.from, options);

    if (definition.auth) {
        app.use(authenticateUser, proxy);
    } else {
        app.use(proxy);
    }

    console.log(`Proxy registered: forward ${definition.from} to ${options.target}`);
}

function getProxyOptions(definition) {
    const target = constructUrl(definition.to);
    const changeOrigin = true;

    const pathRewrite = {};
    pathRewrite[`^${definition.from}`] = '/'; /* cut base path */

    const logLevel = 'warn';

    return {target, changeOrigin, pathRewrite, logLevel};
}
