import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import UCSBorganisationEditPage from "main/pages/UCSBorganisation/UCSBorganisationEditPage";
import { UCSBorganisationFixture } from 'fixtures/UCSBorganisationFixture';

export default {
    title: 'pages/UCSBorganisation/UCSBorganisationEditPage',
    component: UCSBorganisationEditPage
};

const Template = () => <UCSBorganisationEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/UCSBOrganization', (_req, res, ctx) => {
            return res(ctx.json(UCSBorganisationFixture.threeOrganisation[0]));
        }),
        rest.put('/api/UCSBOrganization', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



