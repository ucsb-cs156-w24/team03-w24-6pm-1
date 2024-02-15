import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import ArticlesTable from "main/components/Articles/ArticlesTable";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("ArticlesTables tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Title", "URL", "Explanation", "Email", "Date Added"];
  const expectedFields = ["id", "title", "url", "explanation", "email", "dateAdded"];
  const testId = "ArticlesTable";

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("How artificial intelligence is transforming the world");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.brookings.edu/articles/how-artificial-intelligence-is-transforming-the-world/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Artificial intelligence (AI) is a wide-ranging tool that enables people to rethink how we integrate information, analyze data, and use the resulting insights to improve decision making—and already it is transforming every walk of life. In this report, Darrell West and John Allen discuss AI’s application across a variety of sectors, address issues in its development, and offer recommendations for getting the most out of AI while still protecting important human values.");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("shashank790@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2024-02-14T00:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Artificial Intelligence and the Future of Humans");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("https://www.pewresearch.org/internet/2018/12/10/artificial-intelligence-and-the-future-of-humans/");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("Experts say the rise of artificial intelligence will make most people better off over the next decade, but many have concerns about how advances in AI will affect what it means to be human, to be productive and to exercise free will.");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("shashank790@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2024-02-14T00:00:00");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("How artificial intelligence is transforming the world");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.brookings.edu/articles/how-artificial-intelligence-is-transforming-the-world/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Artificial intelligence (AI) is a wide-ranging tool that enables people to rethink how we integrate information, analyze data, and use the resulting insights to improve decision making—and already it is transforming every walk of life. In this report, Darrell West and John Allen discuss AI’s application across a variety of sectors, address issues in its development, and offer recommendations for getting the most out of AI while still protecting important human values.");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("shashank790@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2024-02-14T00:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Artificial Intelligence and the Future of Humans");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("https://www.pewresearch.org/internet/2018/12/10/artificial-intelligence-and-the-future-of-humans/");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("Experts say the rise of artificial intelligence will make most people better off over the next decade, but many have concerns about how advances in AI will affect what it means to be human, to be productive and to exercise free will.");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("shashank790@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2024-02-14T00:00:00");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("How artificial intelligence is transforming the world");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.brookings.edu/articles/how-artificial-intelligence-is-transforming-the-world/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Artificial intelligence (AI) is a wide-ranging tool that enables people to rethink how we integrate information, analyze data, and use the resulting insights to improve decision making—and already it is transforming every walk of life. In this report, Darrell West and John Allen discuss AI’s application across a variety of sectors, address issues in its development, and offer recommendations for getting the most out of AI while still protecting important human values.");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("shashank790@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2024-02-14T00:00:00");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/articles/edit/2'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("How artificial intelligence is transforming the world");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.brookings.edu/articles/how-artificial-intelligence-is-transforming-the-world/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Artificial intelligence (AI) is a wide-ranging tool that enables people to rethink how we integrate information, analyze data, and use the resulting insights to improve decision making—and already it is transforming every walk of life. In this report, Darrell West and John Allen discuss AI’s application across a variety of sectors, address issues in its development, and offer recommendations for getting the most out of AI while still protecting important human values.");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("shashank790@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2024-02-14T00:00:00");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});