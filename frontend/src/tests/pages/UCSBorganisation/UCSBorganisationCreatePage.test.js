import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBorganisationCreatePage from "main/pages/UCSBorganisation/UCSBorganisationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom"; 
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBorganisationCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBorganisationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /UCSBOrganization", async () => {

        const queryClient = new QueryClient();
        const restaurant = {
            orgCode: "GDSC",
            orgTranslationShort: "Google Developer Student Clubs",
            orgTranslation: "Google Developer Student Clubs",
            inactive: "false"
        };

        axiosMock.onPost("/api/UCSBOrganization/post").reply(202, restaurant);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBorganisationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("orgCode")).toBeInTheDocument();
        });

        const orgCodeInput = screen.getByLabelText("orgCode");
        expect(orgCodeInput).toBeInTheDocument();

        const orgTranslationShortInput = screen.getByLabelText("orgTranslationShort");
        expect(orgTranslationShortInput).toBeInTheDocument();

        const orgTranslationInput = screen.getByLabelText("orgTranslation");
        expect(orgTranslationInput).toBeInTheDocument();

        const inactiveInput = screen.getByLabelText("inactive");
        expect(inactiveInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(orgCodeInput, { target: { value: 'GDSC' } })
        fireEvent.change(orgTranslationShortInput, { target: { value: 'Google Developer Student Clubs' } })
        fireEvent.change(orgTranslationInput, { target: { value: 'Google Developer Student Clubs' } })
        fireEvent.change(inactiveInput, { target: { value: false } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            orgCode: "GDSC",
            orgTranslationShort: "Google Developer Student Clubs",
            orgTranslation: "Google Developer Student Clubs",
            inactive: false
        }); 

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New UCSBorganisation Created - orgCode: GDSC orgTranslationShort: Google Developer Student Clubs orgTranslation:  Google Developer Student Clubs inactive: false");

        expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganization" });

    });
});


