import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import ArticlesTable from "main/components/Articles/ArticlesTable";
// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private long id;

// private String title;
// private String url;
// private String explanation;
// private String email;
// private LocalDateTime dateAdded;

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
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Apple debuts iPhone 15 and iPhone 15 Plus");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.apple.com/newsroom/2023/09/apple-debuts-iphone-15-and-iphone-15-plus/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("A huge leap forward for iPhone with a gorgeous new design featuring a durable, color-infused back glass and new contoured edge; the Dynamic Island; a 48MP Main camera with 2x Telephoto; and USB‑C");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("haroldmo@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-03-11T00:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Apple 16-inch M3 Max MacBook Pro review: A desktop among laptops");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("https://techcrunch.com/2023/11/06/apple-macbook-pro-review-m3-max/");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("The laptop, which starts at $2,500 (plus some pricey add-ons), splits the difference between the Mac Studio and MacBook Air");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("haroldmo@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2022-03-11T00:00:00");

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
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Apple debuts iPhone 15 and iPhone 15 Plus");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.apple.com/newsroom/2023/09/apple-debuts-iphone-15-and-iphone-15-plus/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("A huge leap forward for iPhone with a gorgeous new design featuring a durable, color-infused back glass and new contoured edge; the Dynamic Island; a 48MP Main camera with 2x Telephoto; and USB‑C");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("haroldmo@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-03-11T00:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Apple 16-inch M3 Max MacBook Pro review: A desktop among laptops");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("https://techcrunch.com/2023/11/06/apple-macbook-pro-review-m3-max/");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("The laptop, which starts at $2,500 (plus some pricey add-ons), splits the difference between the Mac Studio and MacBook Air");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("haroldmo@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2022-03-11T00:00:00");

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
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Apple debuts iPhone 15 and iPhone 15 Plus");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.apple.com/newsroom/2023/09/apple-debuts-iphone-15-and-iphone-15-plus/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("A huge leap forward for iPhone with a gorgeous new design featuring a durable, color-infused back glass and new contoured edge; the Dynamic Island; a 48MP Main camera with 2x Telephoto; and USB‑C");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("haroldmo@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-03-11T00:00:00");

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
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Apple debuts iPhone 15 and iPhone 15 Plus");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.apple.com/newsroom/2023/09/apple-debuts-iphone-15-and-iphone-15-plus/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("A huge leap forward for iPhone with a gorgeous new design featuring a durable, color-infused back glass and new contoured edge; the Dynamic Island; a 48MP Main camera with 2x Telephoto; and USB‑C");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("haroldmo@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-03-11T00:00:00");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});