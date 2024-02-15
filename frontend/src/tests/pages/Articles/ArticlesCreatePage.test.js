import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticlesCreatePage tests", () => {

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
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });
    
    test("on submit, makes request to backend, and redirects to /articles", async () => {

        const queryClient = new QueryClient();
        const articles = {
            id: 3,
            title: "Artificial Intelligence and the Future of Humans",
            url: "https://www.pewresearch.org/internet/2018/12/10/artificial-intelligence-and-the-future-of-humans/",
            explanation: "Experts say the rise of artificial intelligence will make most people better off over the next decade, but many have concerns about how advances in AI will affect what it means to be human, to be productive and to exercise free will.",
            email: "shashank790@ucsb.edu",
            dateAdded: "2024-02-14T00:00:00"
        };

        axiosMock.onPost("/api/articles/post").reply(202, articles);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
        });

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();

        const urlInput = screen.getByLabelText("URL");
        expect(urlInput).toBeInTheDocument();

        const explanationInput = screen.getByLabelText("Explanation");
        expect(explanationInput).toBeInTheDocument();

        const emailInput = screen.getByLabelText("Email");
        expect(emailInput).toBeInTheDocument();

        const dateAddedInput = screen.getByLabelText("Date Added");
        expect(dateAddedInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(titleInput, { target: { value: 'Artificial Intelligence and the Future of Humans' } })
        fireEvent.change(urlInput, { target: { value: 'https://www.pewresearch.org/internet/2018/12/10/artificial-intelligence-and-the-future-of-humans/' } })
        fireEvent.change(explanationInput, { target: { value: 'Experts say the rise of artificial intelligence will make most people better off over the next decade, but many have concerns about how advances in AI will affect what it means to be human, to be productive and to exercise free will.' } })
        fireEvent.change(emailInput, { target: { value: 'shashank790@ucsb.edu' } })
        fireEvent.change(dateAddedInput, { target: { value: '2024-02-14T00:00' } })

        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            title: "Artificial Intelligence and the Future of Humans",
            url: "https://www.pewresearch.org/internet/2018/12/10/artificial-intelligence-and-the-future-of-humans/",
            explanation: "Experts say the rise of artificial intelligence will make most people better off over the next decade, but many have concerns about how advances in AI will affect what it means to be human, to be productive and to exercise free will.",
            email: "shashank790@ucsb.edu",
            dateAdded: "2024-02-14T00:00"
        });
    
        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New articles Created - id: 3 title: Artificial Intelligence and the Future of Humans");
        expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

    });
});

