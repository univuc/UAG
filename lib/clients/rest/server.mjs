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

import {createProxyMiddleware} from 'http-proxy-middleware';
import extractDestinationUrl from '../../common/utils/url';
import routeDefinitions from './routes';
import authenticateUser from './middleware/auth';
import cookieParser from 'cookie-parser';
import express from 'express';
import config from '../../../config';


export default function startRestGateway() {
    const app = express();

    registerMiddleware(app);
    registerRoutes(app);

    app.listen(config.ports.uag_rest);
}

function registerMiddleware(app) {
    app.use(cookieParser);
}

function registerRoutes(app) {
    for (const definition of routeDefinitions) {
        const target = extractDestinationUrl(definition.to);
        const changeOrigin = true;

        if (definition.auth) {
            app.use(definition.from, authenticateUser, createProxyMiddleware({target, changeOrigin}));
        } else {
            app.use(definition.from, createProxyMiddleware({target, changeOrigin}));
        }

        console.log(`Proxy registered: forward ${definition.from} to ${target}`);
    }
}
