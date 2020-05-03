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

export default function constructUrl(scheme) {
    const protocol = scheme.protocol || 'http';
    const host = scheme.host || 'localhost';
    const port = scheme.port || 8080;
    const path = scheme.path || '/';

    return getUrl(protocol, host, port, path);
}

function getUrl(protocol, host, port, path) {
    const url = new URL(`${protocol}://${host}`);
    url.port = port;
    url.pathname = path;

    return url.toString();
}

