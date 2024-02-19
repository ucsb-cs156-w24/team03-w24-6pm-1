import React from 'react';
import UCSBorganisationTable from 'main/components/UCSBorganisation/UCSBorganisationTable';
import { UCSBorganisationFixture } from 'fixtures/UCSBorganisationFixture';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBorganisation/UCSBorganisationTable',
    component: UCSBorganisationTable
};

const Template = (args) => {
    return (
        <UCSBorganisationTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    UCSBOrganization: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    UCSBOrganization: UCSBorganisationFixture.threeOrganisation,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    UCSBOrganization: UCSBorganisationFixture.threeOrganisation,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/UCSBOrganization', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
