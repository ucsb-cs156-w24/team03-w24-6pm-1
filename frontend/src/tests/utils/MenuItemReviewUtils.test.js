import { onDeleteSuccess, cellToAxiosParamsDelete } from "main/utils/MenuItemReviewUtils";
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

describe("MenuItemReviewUtils", () => {

    describe("onDeleteSuccess", () => {

        test("It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            onDeleteSuccess("abc");

            // assert
            expect(mockToast).toHaveBeenCalledWith("abc");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("abc");

            restoreConsole();
        });

    });
    describe("cellToAxiosParamsDelete", () => {

        test("It returns the correct params", () => {
            // arrange
            const cell = { row: { values: { id: 1 } } };

         
            const result = cellToAxiosParamsDelete(cell);

            
            expect(result).toEqual({
                url: "/api/menuitemreview",
                method: "DELETE",
                params: { id: 1 }
            });
        });

        test("Must pass in a parameter", () => {
            // arrange
            const cell = { row: { values: {} } };

            
            const result = cellToAxiosParamsDelete(cell);

            // assert
            expect(result).toEqual({
                url: "/api/menuitemreview",
                method: "DELETE",
                params: {
                    "id": undefined
                }
            });
          
        });

    });
});




