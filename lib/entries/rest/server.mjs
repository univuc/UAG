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

import routeDefinitions from './definitions';
import registerProxy from './route/rest';
import logger from 'iab/lib/utils/logger';
import config from '../../../config';

export default function setRestGateway(app) {
    registerRoutes(app);

    logger.info(`HTTP proxy server set. Listening on ${config.ports.uag}`);
}

function registerRoutes(app) {
    for (const definition of routeDefinitions) {
        registerProxy(app, definition);
    }
}
