/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";

import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        /*test("Then bill icon in vertical layout should be highlighted", async () => {
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
            router();

            window.onNavigate(ROUTES_PATH.Bills);
            await waitFor(() => screen.getByTestId("icon-window"));
            const windowIcon = screen.getByTestId("icon-window");
            expect(windowIcon.classList.contains("active-icon")).toBe(true);
        });

        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({ data: bills });
            const dates = screen
                .getAllByTestId(
                    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
                )
                .map((a) => a.getAttribute("data-testid"));
            const antiChrono = (a, b) => new Date(b) - new Date(a);
            const datesSorted = [...dates].sort(antiChrono);
            expect(dates).toEqual(datesSorted);
        });

        test("Then new bill button should redirect to new bill page", async () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );
            document.body.innerHTML = BillsUI({ data: { bills } });
            const billsLogic = new Bills({
                document,
                onNavigate,
                store: null,
                bills: bills,
                localStorage: window.localStorage,
            });

            const newBillBtn = await waitFor(() =>
                screen.getByTestId("btn-new-bill")
            );
            expect(newBillBtn).toBeTruthy();

            const spyHandleClickNewBill = jest.spyOn(
                billsLogic,
                "handleClickNewBill"
            );
            newBillBtn.addEventListener("click", spyHandleClickNewBill);
            fireEvent.click(newBillBtn);
            expect(spyHandleClickNewBill).toHaveBeenCalled();

            const page = await waitFor(() =>
                screen.getByTestId("page-new-bill")
            );
            expect(page).toBeTruthy();
        });*/

        test("Picture modal should be open", async () => {
            $.fn.modal = jest.fn();
            document.body.innerHTML = BillsUI({ data: bills });
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };
            const billsContainer = new Bills({
                document,
                onNavigate,
                store: mockStore.bills(),
                localStorage: window.localStorage,
            });
            const iconEye = screen.getAllByTestId("icon-eye")[0];
            const handleClickIconEyeMock = jest.fn((e) =>
                billsContainer.handleClickIconEye(e.target)
            );
            iconEye.addEventListener("click", handleClickIconEyeMock);
            fireEvent.click(iconEye);
            expect(handleClickIconEyeMock).toHaveBeenCalled();
            expect(screen.getAllByText("Justificatif")).toBeTruthy();
            expect(screen.getAllByTestId("modaleBill")).toBeTruthy();
        });

        /*test("Then getBills should return formatted bills", async () => {
            const storeMock = {
                bills: () => ({
                    list: () =>
                        Promise.resolve([
                            { id: 1, status: "pending", date: "2023-01-01" },
                            { id: 2, status: "refused", date: "2023-02-01" },
                        ]),
                }),
            };

            const billsContainer = new Bills({
                document,
                onNavigate: jest.fn(),
                store: storeMock,
                localStorage: window.localStorage,
            });

            const result = await billsContainer.getBills();

            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ status: "En attente" }),
                    expect.objectContaining({ status: "Refusé" }),
                ])
            );
        });

        test("Then getBills should return fallback format on error", async () => {
            const corruptedStore = {
                bills: () => ({
                    list: () =>
                        Promise.resolve([
                            { id: 1, status: "pending", date: undefined },
                        ]),
                }),
            };

            const billsContainer = new Bills({
                document,
                onNavigate: jest.fn(),
                store: corruptedStore,
                localStorage: window.localStorage,
            });

            const result = await billsContainer.getBills();

            expect(result[0].date).toBeUndefined();
            expect(result[0].status).toBe("En attente");
        });
    });*/
    });

    // Mock du formatStatus si utilisé
    /*jest.mock("../app/format.js", () => ({
    formatStatus: (status) => `formatted-${status}`,
}));*/

    /*describe("Integration test: getBills", () => {
    test("should fetch bills from mock API and format their status", async () => {
        const billsContainer = new Bills({
            document,
            onNavigate: jest.fn(),
            store: mockStore,
            localStorage: window.localStorage,
        });

        const fetchedBills = await billsContainer.getBills();

        // Vérifie que le mock a bien été appelé
        expect(mockStore.bills).toHaveBeenCalled();
        expect(mockStore.bills().list).toHaveBeenCalled();

        // Vérifie que le tableau retourné est correct
        expect(fetchedBills).toBeTruthy();
        expect(Array.isArray(fetchedBills)).toBe(true);
        expect(fetchedBills.length).toBeGreaterThan(0);

        // Vérifie le format d'une facture
        expect(fetchedBills[0]).toHaveProperty("status");
        expect(fetchedBills[0].status).toMatch(/^formatted-/); // car mocké
    });

    test("should catch formatting errors and log them", async () => {
        // Crée un store avec une facture corrompue (status manquant)
        const corruptedStore = {
            bills: () => ({
                list: () =>
                    Promise.resolve([
                        {
                            id: "bad-bill",
                            date: "2022-01-01",
                            // pas de "status"
                        },
                    ]),
            }),
        };

        console.log = jest.fn(); // on espionne les logs

        const billsContainer = new Bills({
            document,
            onNavigate: jest.fn(),
            store: corruptedStore,
            localStorage: window.localStorage,
        });

        const fetchedBills = await billsContainer.getBills();

        // Vérifie que le fallback du catch est bien passé
        expect(console.log).toHaveBeenCalled();
        expect(fetchedBills[0]).toMatchObject({
            id: "bad-bill",
            date: "2022-01-01",
            status: "formatted-undefined", // car le mock transforme même un status manquant
        });
    });*/
});
