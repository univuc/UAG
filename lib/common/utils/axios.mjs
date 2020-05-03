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

import axios from 'axios';
import logger from './logger';

export async function get(url) {
    return await safeRequest('GET', url);
}

export async function post(url, data) {
    return await safeRequest('POST', url, data);
}

export async function request(method, url, data) {
    return await safeRequest(method, url, data);
}

async function safeRequest(method, url, data) {
    logger.verbose(`${method} ${url}`);

    try {
        return await axios.request({method, url, data});
    } catch (e) {
        logger.warn(`Request failed: ${e.toString()}`);
        return null;
    }
}
