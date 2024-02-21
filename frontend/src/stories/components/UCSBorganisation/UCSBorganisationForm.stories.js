import React from 'react';
import UCSBorganisationForm from "main/components/UCSBorganisation/UCSBorganisationForm"
import { UCSBorganisationFixture } from 'fixtures/UCSBorganisationFixture';

export default {
    title: 'components/UCSBorganisation/UCSBorganisationForm',
    component: UCSBorganisationForm
};

const Template = (args) => {
    return (
        <UCSBorganisationForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
         console.log("Submit was clicked with data: ", data); 
         window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: UCSBorganisationFixture.oneOrganisation[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};