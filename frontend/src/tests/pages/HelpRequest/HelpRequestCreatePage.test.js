import { render, waitFor, fireEvent, screen} from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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


describe("HelpRequestCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });


    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const helpRequest = {
            id: 1,
            requesterEmail: "cgaucho@ucsb.edu",
            teamId: "s22-5pm-3",
            tableOrBreakoutRoom: "7",
            requestTime: "2022-04-20T17:35",
            explanation: "Need help with Swagger-ui",
            solved: "true"
        };

        axiosMock.onPost("/api/helprequests/post").reply( 202, helpRequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("HelpRequestForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmail = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamId = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoom = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTime = screen.getByTestId("HelpRequestForm-requestTime");
        const explanation = screen.getByTestId("HelpRequestForm-explanation");
        const solved = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmail, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(teamId, { target: { value: 's22-5pm-3' } });
        fireEvent.change(tableOrBreakoutRoom, { target: { value: '7' } });
        fireEvent.change(requestTime, { target: { value: '2022-04-20T17:35' } });
        fireEvent.change(explanation, { target: { value: 'Need help with Swagger-ui' } });
        fireEvent.change(solved, { target: { value: 'true' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "requesterEmail": "cgaucho@ucsb.edu",
                "teamId": "s22-5pm-3",
                "tableOrBreakoutRoom": "7",
                "requestTime": "2022-04-20T17:35",
                "explanation": "Need help with Swagger-ui",
                "solved": "true"
        });

        expect(mockToast).toBeCalledWith("New Help Request Created - id: 1 email: cgaucho@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequests" });
    });

    // const queryClient = new QueryClient();
    // test("Renders expected content", () => {
    //     // arrange

    //     setupUserOnly();
       
    //     // act
    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <HelpRequestCreatePage />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     // assert
    //     expect(screen.getByText("Create page not yet implemented")).toBeInTheDocument();
    // });

});


