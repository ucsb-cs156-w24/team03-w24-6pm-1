import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBorganisationIndexPage from "main/pages/UCSBorganisation/UCSBorganisationIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { UCSBorganisationFixture } from "fixtures/UCSBorganisationFixture";

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

describe("UCSBorganisationIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "UCSBorganisationTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/UCSBOrganization/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBorganisationIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create UCSBorganisation/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create UCSBorganisation/);
        expect(button).toHaveAttribute("href", "/UCSBOrganization/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three restaurants correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/UCSBOrganization/all").reply(200, UCSBorganisationFixture.threeOrganisation);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBorganisationIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("GDSC"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("UCIV");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-orgCode`)).toHaveTextContent("WiCS");

        const createUCSBorganisationButton = screen.queryByText("Create UCSBorganisation");
        expect(createUCSBorganisationButton).not.toBeInTheDocument();

        const orgTranslationShort = screen.getByText("UC in Isla Vista");
        expect(orgTranslationShort).toBeInTheDocument();

        const orgTranslation = screen.getByText("University of California in Isla Vista");
        expect(orgTranslation).toBeInTheDocument();

        const inactive = screen.getAllByText("false") 
        expect(inactive.some((element) => element.textContent === "false")).toBeTruthy(); 

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("UCSBorganisationTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("UCSBorganisationTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/UCSBOrganization/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBorganisationIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/UCSBOrganization/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/UCSBOrganization/all").reply(200,  UCSBorganisationFixture.threeOrganisation);
        axiosMock.onDelete("/api/UCSBOrganization").reply(200, "UCSBorganisation with orgCode GDSC was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBorganisationIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("GDSC");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("UCSBorganisation with orgCode GDSC was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/UCSBOrganization");
        expect(axiosMock.history.delete[0].url).toBe("/api/UCSBOrganization");
        // expect(axiosMock.history.delete[0].params).toEqual({ orgCode: "GDSC" });
    });

});


