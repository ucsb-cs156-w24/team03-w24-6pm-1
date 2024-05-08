import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBorganisationForm from "main/components/UCSBorganisation/UCSBorganisationForm";
import { UCSBorganisationFixture } from "fixtures/UCSBorganisationFixture";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBorganisationForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["orgCode", "orgTranslationShort", "orgTranslation"];
    const testId = "UCSBorganisationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBorganisationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBorganisationForm initialContents={UCSBorganisationFixture.oneRestaurant} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
        expect(screen.getByText(`orgCode`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBorganisationForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBorganisationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByTestId(`${testId}-submit`);
        fireEvent.click(submitButton);

        expect(await screen.findByText(/orgCode is required/)).toBeInTheDocument();
        expect(await screen.findByText(/orgTranslationShort is required/)).toBeInTheDocument();
        expect(await screen.findByText(/orgTranslation is required/)).toBeInTheDocument();

        const nameInput = screen.getByTestId(`${testId}-orgCode`);
        fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);
    

    });

});