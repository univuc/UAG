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

import requestDefinitions from '../definitions';
import {requestInternal} from 'iab/lib/utils/axios';
import constructUrl from 'iab/lib/utils/url';
import {getUser} from 'iab/lib/api/UIP';
import logger from 'iab/lib/utils/logger';
import config from '../../../../config';

export default {

    async handleCommand(req, res) {
        const event = req.body;

        const definition = getCommandDefinition(event);
        if (!definition) {
            return null;
        }

        const requestOptions = await createRequestOptions(event, definition);
        if (!requestOptions) {
            return null;
        }

        const result = await requestInternal(requestOptions);
        if (result) {
            onSuccess(res, result);
        } else {
            onFail(res);
        }
    },

};

function getCommandDefinition(event) {
    const definition = requestDefinitions.find((def) => def.command === event.command);
    if (!definition) {
        logger.warn(`No such command as ${event.command}`);
        return null;
    }

    const isValid = definition.do.validate(event);
    if (!isValid) {
        logger.warn(`Command invalid: [${event.command} ${event.text}]`);
        return null;
    }

    return definition;
}

async function createRequestOptions(event, definition) {
    const url = getUrl(event, definition);
    const method = getMethod(definition);
    const payload = getPayload(event, definition);
    const headers = {
        'Internal-Slack-Auth': config.secrets.internal_slack,
    };

    if (needsAuth(definition)) {
        const id = await getValidUserId(event);
        if (!id) {
            return null;
        }

        headers['User-Identity'] = id;
    }

    return {url, method, headers, payload};
}

function getUrl(event, definition) {
    let url = constructUrl(definition.to);
    const params = definition.do.getParams ? definition.do.getParams(event) : null;
    if (params) {
        url = url.appendUrl(params.join('/'));
    }

    return url;
}

function getMethod(definition) {
    return definition.do.method;
}

function getPayload(event, definition) {
    return definition.do.getPayload ? definition.do.getPayload(event) : null;
}

function needsAuth(definition) {
    return definition.auth;
}

async function getValidUserId(event) {
    const user = await getUser(event.user_id);
    if (!user) {
        logger.warn(`${event.command} requires auth but ${event.user_id} is not a member`);
        return null;
    }

    return user.id;
}

function onSuccess(res, result) {
    res.status(200).json({
        response_type: 'ephemeral',
        text: result,
    });
}

function onFail(res) {
    res.status(400).send();
}
