import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { UCSBorganisationFixture } from "fixtures/UCSBorganisationFixture";
import { rest } from "msw";

import UCSBorganisationIndexPage from "main/pages/UCSBorganisation/UCSBorganisationIndexPage";

export default {
    title: 'pages/UCSBorganisation/UCSBorganisationIndexPage',
    component: UCSBorganisationIndexPage
};

const Template = () => <UCSBorganisationIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/UCSBOrganization/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
    ]
}

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/UCSBOrganization/all', (_req, res, ctx) => {
            return res(ctx.json(UCSBorganisationFixture.threeOrganisation));
        }),
    ],
}

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/UCSBOrganization/all', (_req, res, ctx) => {
            return res(ctx.json(UCSBorganisationFixture.threeOrganisation));
        }),
        rest.delete('/api/UCSBOrganization', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}
