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

import getEnv from './lib/common/utils/env';

export default {
    ports: {
        uag_rest: getEnv('UAG_PORT_REST') || 21100,
        uag_slack: get('UAG_PORT_SLACK') || 21101,

        uas: getEnv('UAS_PORT'),
        lms: getEnv('LMS_PORT'),
        snl: getEnv('SNL_PORT'),
        aicro: getEnv('AICRO_PORT'),
    },

    endpoints: {
        get_user_by_user_id: {
            port: getEnv('UIP_PORT'),
            path: '/get-user-by-user-id',
        },
        get_user_by_slack_user_id: {
            port: getEnv('UIP_PORT'),
            path: '/get-user-by-slack-user-id',
        },
    },

    secrets: {
        sso: getEnv('UNIVUC_SSO_SECRET') || 'token',
        slack_signing: getEnv('SLACK_SIGNING_SECRET') || 'secret',
    },
};

