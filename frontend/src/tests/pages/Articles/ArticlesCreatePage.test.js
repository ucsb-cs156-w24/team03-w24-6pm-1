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
    // {
    //     "id": 3,
    //      "title": "Apple 16-inch M3 Max MacBook Pro review: A desktop among laptops",
    //      "url": "https://techcrunch.com/2023/11/06/apple-macbook-pro-review-m3-max/",
    //      "explanation": "The laptop, which starts at $2,500 (plus some pricey add-ons), splits the difference between the Mac Studio and MacBook Air",
    //      "email": "haroldmo@ucsb.edu",
    //      "dateAdded": "2022-03-11T00:00:00"
    // },
    test("on submit, makes request to backend, and redirects to /articles", async () => {

        const queryClient = new QueryClient();
        const articles = {
            id: 3,
            title: "Apple 16-inch M3 Max",
            url: "https://techcrunch.com/2023/11/06/apple-macbook-pro-review-m3-max/",
            explanation: "The laptop, which starts at $2,500 (plus some pricey add-ons), splits the difference between the Mac Studio and MacBook Air",
            email: "haroldmo@ucsb.edu",
            dateAdded: "2022-03-11T00:00"
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

        fireEvent.change(titleInput, { target: { value: 'Apple 16-inch M3 Max' } })
        fireEvent.change(urlInput, { target: { value: 'https://techcrunch.com/2023/11/06/apple-macbook-pro-review-m3-max/' } })
        fireEvent.change(explanationInput, { target: { value: 'The laptop, which starts at $2,500 (plus some pricey add-ons), splits the difference between the Mac Studio and MacBook Air' } })
        fireEvent.change(emailInput, { target: { value: 'haroldmo@ucsb.edu' } })
        fireEvent.change(dateAddedInput, { target: { value: '2022-03-11T00:00' } })

        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            title: "Apple 16-inch M3 Max",
            url: "https://techcrunch.com/2023/11/06/apple-macbook-pro-review-m3-max/",
            explanation: "The laptop, which starts at $2,500 (plus some pricey add-ons), splits the difference between the Mac Studio and MacBook Air",
            email: "haroldmo@ucsb.edu",
            dateAdded: "2022-03-11T00:00"
        });
    
        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New articles Created - id: 3 title: Apple 16-inch M3 Max");
        expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

    });
});

