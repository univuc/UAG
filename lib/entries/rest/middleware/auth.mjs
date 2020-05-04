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

import {getUser} from 'iab/lib/api/UIP';
import config from '../../../../config';
import JWT from 'jsonwebtoken';
import logger from 'iab/lib/utils/logger';

export default async function authenticateUser(req, res, next) {
    const token = parseCookies(req)['univuc_token'];

    const result = verifyJwt(token);
    if (!result) {
        logger.warn('Invalid jwt');
        res.status(401);
        return;
    }

    const userId = result.userId;
    if (!userId) {
        console.log(`No userId field in jwt: ${JSON.stringify(result)}`);
        res.status(401);
        return;
    }

    const user = await getUser(result.userId);
    if (!user) {
        logger.warn(`User ${user.id} is not a member!`);
        res.status(401);
        return;
    }

    req.headers['User-Identity'] = user.id;

    logger.info(`User ${user.id} authenticated`);

    next();
};

function verifyJwt(token) {
    try {
        return JWT.verify(token, config.secrets.sso);
    } catch (e) {
        return null;
    }
}

function parseCookies(request) {
    const list = {};
    const rc = request.headers.cookie;

    rc && rc.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
