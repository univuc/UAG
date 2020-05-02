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

import UserIdentificationProvider from '../../../common/features/UserIdentificationProvider';
import extractDestinationUrl from '../../../common/utils/url';
import requestDefinitions from '../definitions';
import axiosInstance from '../../../common/utils/axios';
import qs from 'querystring';

export default async function routeCommand(req, res) {
    const result = await handleCommand(req.body);

    if (result) {
        onSuccess(res, result);
    } else {
        onFail(res);
    }
}

async function handleCommand(event) {
    const definition = getCommandDefinition(event);
    if (!definition) {
        return null;
    }

    const requestOptions = await extractRequestOptions(event, definition);
    if (!requestOptions) {
        return null;
    }

    const {url, method, payload} = requestOptions;

    return await sendRequest(url, method, payload);
}

function getCommandDefinition(event) {
    const definition = requestDefinitions.find((def) => def.command === event.command);
    if (!definition) {
        console.log(`No such command as ${event.command}`);
        return null;
    }

    const isValid = definition.do.validate(event);
    if (!isValid) {
        console.log(`Command invalid: [${event.command} ${event.text}]`);
        return null;
    }

    return definition;
}

async function extractRequestOptions(event, definition) {
    const url = extractDestinationUrl(definition.to);
    const method = definition.do.method;
    const payload = definition.do.getPayload(event);

    const authIsValid = appendUserIdToPayloadIfNeeded(event, definition, payload);
    if (!authIsValid) {
        return null;
    }

    return {url, method, payload};
}

async function appendUserIdToPayloadIfNeeded(event, definition, payload) {
    if (definition.auth) {
        const user = await getUser(event.user_id);
        if (!user) {
            console.log(`${event.command} requires auth but ${event.user_id} is not a member`);
            return false;
        }

        payload.userId = user.id;
    }

    return true;
}

async function getUser(slackUserId) {
    return await UserIdentificationProvider.getUserBySlackUserId(slackUserId);
}

async function sendRequest(url, method, payload) {
    const options = {
        url: url,
        method: method,
        data: qs.stringify(payload),
    };

    return await axiosInstance.request(options);
}

function onSuccess(res, result) {
    res.status(200).json({
        response_type: 'ephemeral',
        text: result,
    });
}

function onFail(res) {
    res.status(400);
}
