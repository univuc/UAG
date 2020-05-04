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

import authenticateSlackCommand from './middleware/auth';
import collectRawBody from './middleware/body';
import routeCommand from './route/command';
import bodyParser from 'body-parser';
import express from 'express';
import logger from 'iab/lib/utils/logger';
import config from '../../../config';

export default function startSlackGateway() {
    const app = express();

    registerMiddleware(app);
    registerRoutes(app);

    logger.info(`Slack command server created. Listening on ${config.ports.uag_slack}`);

    app.listen(config.ports.uag_slack);
}

function registerMiddleware(app) {
    app.use(collectRawBody);
    app.use(authenticateSlackCommand);
    app.use(bodyParser.urlencoded({extended: true}));
}

function registerRoutes(app) {
    app.post('/slack/command', routeCommand);
}

