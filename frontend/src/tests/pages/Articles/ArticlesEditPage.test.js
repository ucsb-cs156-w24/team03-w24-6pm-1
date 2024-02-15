import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Articles");
            expect(screen.queryByTestId("Articles-title")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: "How artificial intelligence is transforming the world",
                url: "https://www.brookings.edu/articles/how-artificial-intelligence-is-transforming-the-world/",
                explanation: "Artificial intelligence (AI) is a wide-ranging tool that enables people to rethink how we integrate information, analyze data, and use the resulting insights to improve decision making—and already it is transforming every walk of life. In this report, Darrell West and John Allen discuss AI’s application across a variety of sectors, address issues in its development, and offer recommendations for getting the most out of AI while still protecting important human values.",
                email: "shashank790@ucsb.edu",
                dateAdded: "2024-02-14T00:00:00"
            });
            axiosMock.onPut('/api/articles').reply(200, {
                id: "17",
                title: "The Future Of Artificial Intelligence",
                url: "https://www.forbes.com/sites/forbestechcouncil/2023/04/10/the-future-of-artificial-intelligence/?sh=3654736b4ac4",
                explanation: "Peter van der Made is the founder and CTO of BrainChip Ltd. BrainChip produces advanced AI processors in digital neuromorphic technologies.",
                email: "shashank790@ucsb.edu",
                dateAdded: "2024-02-14T00:00:00"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");

            expect(titleField).toBeInTheDocument();
            expect(titleField).toHaveValue("How artificial intelligence is transforming the world");

            expect(urlField).toBeInTheDocument();
            expect(urlField).toHaveValue("https://www.brookings.edu/articles/how-artificial-intelligence-is-transforming-the-world/");
            
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("Artificial intelligence (AI) is a wide-ranging tool that enables people to rethink how we integrate information, analyze data, and use the resulting insights to improve decision making—and already it is transforming every walk of life. In this report, Darrell West and John Allen discuss AI’s application across a variety of sectors, address issues in its development, and offer recommendations for getting the most out of AI while still protecting important human values.");
            
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("shashank790@ucsb.edu");
            
            expect(dateAddedField).toBeInTheDocument();
            expect(dateAddedField).toHaveValue("2024-02-14T00:00");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(titleField, { target: { value: 'The Future Of Artificial Intelligence' } });
            fireEvent.change(urlField, { target: { value: 'https://www.forbes.com/sites/forbestechcouncil/2023/04/10/the-future-of-artificial-intelligence/?sh=3654736b4ac4' } });
            fireEvent.change(explanationField, { target: { value: 'Peter van der Made is the founder and CTO of BrainChip Ltd. BrainChip produces advanced AI processors in digital neuromorphic technologies.' } });
            fireEvent.change(emailField, { target: { value: 'shashank790@ucsb.edu' } });
            fireEvent.change(dateAddedField, { target: { value: '2024-02-14T00:00:00' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Articles Updated - id: 17 title: The Future Of Artificial Intelligence");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: 'The Future Of Artificial Intelligence',
                url: 'https://www.forbes.com/sites/forbestechcouncil/2023/04/10/the-future-of-artificial-intelligence/?sh=3654736b4ac4',
                explanation: 'Peter van der Made is the founder and CTO of BrainChip Ltd. BrainChip produces advanced AI processors in digital neuromorphic technologies.',
                email: 'shashank790@ucsb.edu',
                dateAdded: '2024-02-14T00:00'
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("How artificial intelligence is transforming the world");
            expect(urlField).toHaveValue("https://www.brookings.edu/articles/how-artificial-intelligence-is-transforming-the-world/");
            expect(explanationField).toHaveValue("Artificial intelligence (AI) is a wide-ranging tool that enables people to rethink how we integrate information, analyze data, and use the resulting insights to improve decision making—and already it is transforming every walk of life. In this report, Darrell West and John Allen discuss AI’s application across a variety of sectors, address issues in its development, and offer recommendations for getting the most out of AI while still protecting important human values.")
            expect(emailField).toHaveValue("shashank790@ucsb.edu");
            expect(dateAddedField).toHaveValue("2024-02-14T00:00");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'The Future Of Artificial Intelligence' } });
            fireEvent.change(urlField, { target: { value: 'https://www.forbes.com/sites/forbestechcouncil/2023/04/10/the-future-of-artificial-intelligence/?sh=3654736b4ac4' } });
            fireEvent.change(explanationField, { target: { value: 'Peter van der Made is the founder and CTO of BrainChip Ltd. BrainChip produces advanced AI processors in digital neuromorphic technologies.' } });
            fireEvent.change(emailField, { target: { value: 'shashank790@ucsb.edu' } });
            fireEvent.change(dateAddedField, { target: { value: '2024-02-14T00:00:00' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Articles Updated - id: 17 title: The Future Of Artificial Intelligence");
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });
        });

       
    });
});