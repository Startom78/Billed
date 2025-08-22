/**
 * @jest-environment jsdom
 */

import NewBill from "../containers/NewBill.js";
import { screen, fireEvent, waitFor, wait } from "@testing-library/dom";
import mockStore from "../__mocks__/store.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        beforeEach(() => {
            Object.defineProperty(window, "localStorage", {
                value: {
                    getItem: jest.fn(() =>
                        JSON.stringify({ email: "employee@test.tld" })
                    ),
                    setItem: jest.fn(),
                },
                writable: true,
            });

            document.body.innerHTML = NewBillUI();

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            });
        });

        test("Then it should handle valid file input", async () => {
            const fileInput = screen.getByTestId("file");
            expect(fileInput).toBeTruthy();
            const file = new File(["image"], "image.png", {
                type: "image/png",
            });
            fireEvent.change(fileInput, {
                target: { files: [file] },
            });

            expect(fileInput.files[0]).toBe(file);
            const fileError = await waitFor(() =>
                screen.getByTestId("file-error")
            );

            expect(fileError.textContent).toBeFalsy();
        });

        test("Then it should reject invalid file type", async () => {
            const fileInput = screen.getByTestId("file");
            const file = new File(["test"], "test.txt", { type: "text/plain" });

            userEvent.upload(fileInput, file);
            const fileError = await waitFor(() =>
                screen.getByTestId("file-error")
            );

            expect(fileError.textContent).toBeTruthy();
        });

        test("Then it should submit the form and call updateBill", async () => {
            // remplir tous les champs nécessaires
            const expenseType = screen.getByTestId("expense-type");
            const expenseName = screen.getByTestId("expense-name");
            const amount = screen.getByTestId("amount");
            const datePicker = screen.getByTestId("datepicker");
            const vat = screen.getByTestId("vat");
            const pct = screen.getByTestId("pct");
            const commentary = screen.getByTestId("commentary");
            const form = screen.getByTestId("form-new-bill");

            fireEvent.change(expenseType, {
                target: { value: "Transports" },
            });
            fireEvent.change(expenseName, {
                target: { value: "Billet de train" },
            });
            fireEvent.change(amount, {
                target: { value: "120" },
            });
            fireEvent.change(datePicker, {
                target: { value: "2025-07-25" },
            });
            fireEvent.change(vat, {
                target: { value: "20" },
            });
            fireEvent.change(pct, {
                target: { value: "20" },
            });
            fireEvent.change(commentary, {
                target: { value: "Déplacement pro" },
            });

            fireEvent.submit(form);

            const newNote = await waitFor(() =>
                screen.getByText("Mes notes de frais")
            );
            expect(newNote).toBeTruthy();
        });
    });
});
