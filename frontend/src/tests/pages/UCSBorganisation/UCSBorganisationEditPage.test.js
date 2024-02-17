import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBorganisationEditPage from "main/pages/UCSBorganisation/UCSBorganisationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            orgCode: "GDSC" 
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBorganisationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: {             orgCode: "GDSC"            } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBorganisationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBorganisation");
            expect(screen.queryByTestId("UCSBorganisation-orgCode")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: {             orgCode: "GDSC"            } }).reply(200, {
                orgCode: "GDSC",
                orgTranslationShort: "Google Developer Student Clubs",
                orgTranslation: "Google Developer Student Clubs",
                inactive : "true"

            });
            axiosMock.onPut('/api/UCSBOrganization').reply(200, {
                orgCode: "GDSC",
                orgTranslationShort: "Google Developer Student Clubs",
                orgTranslation: "Google Developer Student Clubs",
                inactive : "false"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBorganisationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBorganisationForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBorganisationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBorganisationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBorganisationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBorganisationForm-inactive");
            const submitButton = screen.getByTestId("UCSBorganisationForm-submit");

            expect(orgCodeField).toBeInTheDocument();
            expect(orgCodeField).toHaveValue("GDSC");
            expect(orgTranslationShortField).toBeInTheDocument();
            expect(orgTranslationShortField).toHaveValue("Google Developer Student Clubs");
            expect(orgTranslationField).toBeInTheDocument();
            expect(orgTranslationField).toHaveValue("Google Developer Student Clubs");
            expect(inactiveField).toBeInTheDocument();
            expect(inactiveField).toBeChecked("true"); 

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(orgCodeField, { target: { value: 'UCSB-GDSC' } });
            fireEvent.change(orgTranslationShortField, { target: { value: 'UCSB-Google Developer Student Clubs' } });
            fireEvent.change(orgTranslationField, { target: { value: 'University of California Santa Barbara-Google Developer Student Clubs' } });
            fireEvent.change(inactiveField, { target: { value: 'false' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBorganisation Updated - orgCode: GDSC orgTranslationShort: Google Developer Student Clubs orgTranslation: Google Developer Student Clubs inactive: false");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganization" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "UCSB-GDSC" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgCode: "UCSB-GDSC",
                orgTranslationShort: "UCSB-Google Developer Student Clubs",
                orgTranslation: "University of California Santa Barbara-Google Developer Student Clubs",
                inactive : "true"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBorganisationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBorganisationForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBorganisationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBorganisationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBorganisationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBorganisationForm-inactive");
            const submitButton = screen.getByTestId("UCSBorganisationForm-submit");

            expect(orgCodeField).toHaveValue("GDSC");
            expect(orgTranslationShortField).toHaveValue("Google Developer Student Clubs");
            expect(orgTranslationField).toHaveValue("Google Developer Student Clubs");
            expect(inactiveField).toBeChecked("true");

            fireEvent.change(orgTranslationShortField, { target: { value: 'Goblin Dance Squad Contest' } })
            fireEvent.change(orgTranslationField, { target: { value: 'Goblin Dance Squad Contest' } })
            fireEvent.change(inactiveField, { target: { value: 'true' } });
            fireEvent.click(submitButton);

            
            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBorganisation Updated - orgCode: GDSC orgTranslationShort: Goblin Dance Squad Contest orgTranslation: Goblin Dance Squad Contest inactive: false"); 

            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganization" });
        });

       
    });
});

