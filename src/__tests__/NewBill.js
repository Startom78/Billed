/**
 * @jest-environment jsdom
 */

import NewBill from "../containers/NewBill.js";
import { screen, fireEvent, waitFor, wait } from "@testing-library/dom";
import mockStore from "../__mocks__/store.js";
import { ROUTES_PATH } from "../constants/routes.js";
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
                document.body.innerHTML = ROUTES_PATH[pathname];
            };

            new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            });
        });

        test("Then it should handle valid file input", async () => {
            const fileInput = document.querySelector(
                'input[data-testid="file"]'
            ); //await waitFor(() => screen.getByTestId("file"));
            expect(fileInput).toBeTruthy();
            const file = new File(["image"], "image.png", {
                type: "image/png",
            });
            fireEvent.change(fileInput, {
                target: { files: [file] },
            });
            console.log("file input", fileInput);
            console.log(fileInput.files[0].type, file.type);
            expect(fileInput.files[0]).toBe(file);
            const fileError = await waitFor(() =>
                screen.getAllByTestId("file-error")
            );
            expect(fileInput.files[0]).toStrictEqual(file);
            expect(fileInput.files).toHaveLength(1);
            expect(fileError.textContent).toBeFalsy();
        });
        /* 
        test("Then it should reject invalid file type", async () => {
            const fileInput = screen.getByTestId("file");
            const file = new File(["test"], "test.txt", { type: "text/plain" });

            await waitFor(() => userEvent.upload(fileInput, file));

            expect(fileInput.value).toBe("");
            expect(screen.getByText("Extension invalide")).toBeVisible();
        });

        test("Then it should submit the form and call updateBill", async () => {
            // remplir tous les champs nécessaires
            fireEvent.change(screen.getByTestId("expense-type"), {
                target: { value: "Transports" },
            });
            fireEvent.change(screen.getByTestId("expense-name"), {
                target: { value: "Billet de train" },
            });
            fireEvent.change(screen.getByTestId("amount"), {
                target: { value: "120" },
            });
            fireEvent.change(screen.getByTestId("datepicker"), {
                target: { value: "2025-07-25" },
            });
            fireEvent.change(screen.getByTestId("vat"), {
                target: { value: "20" },
            });
            fireEvent.change(screen.getByTestId("pct"), {
                target: { value: "20" },
            });
            fireEvent.change(screen.getByTestId("commentary"), {
                target: { value: "Déplacement pro" },
            });

            // simuler un fichier valide
            const file = new File(["image"], "test.png", { type: "image/png" });
            const fileInput = screen.getByTestId("file");
            await waitFor(() => userEvent.upload(fileInput, file));

            const form = screen.getByTestId("form-new-bill");
            fireEvent.submit(form);

            expect(await screen.findByText(ROUTES_PATH.Bills)).toBeTruthy();
        });

        test("Then it should catch error on submit", async () => {
            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation();
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    create: () => Promise.reject(new Error("Erreur API")),
                };
            });

            const form = screen.getByTestId("form-new-bill");
            fireEvent.submit(form);

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalled();
                expect(consoleSpy.mock.calls[0][0].message).toBe("Erreur API");
            });

            consoleSpy.mockRestore();
        });*/
    });
});
/*
// Mock du localStorage
Object.defineProperty(window, "localStorage", {
    value: {
        getItem: jest.fn(() => JSON.stringify({ email: "employee@test.tld" })),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    },
});

// Mock de navigation
const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES_PATH[pathname];
};

describe("Integration Test: NewBill", () => {
    beforeEach(() => {
        // Met en place le DOM avec la vue NewBill
        document.body.innerHTML = `<div id="root"></div>`;
        router(); // initialise les routes
        window.onNavigate(ROUTES_PATH.NewBill);
    });

    test("should submit a valid bill and navigate to Bills page", async () => {
        const newBill = new NewBill({
            document,
            onNavigate,
            store: mockStore,
            localStorage: window.localStorage,
        });

        // Mock du retour d'upload de fichier
        mockStore.bills().create = jest.fn(() =>
            Promise.resolve({ fileUrl: "url.jpg", key: "1234" })
        );

        // Mock de la mise à jour
        mockStore.bills().update = jest.fn(() => Promise.resolve());

        // Remplir les champs du formulaire
        fireEvent.change(screen.getByTestId("expense-type"), {
            target: { value: "Transports" },
        });
        fireEvent.change(screen.getByTestId("expense-name"), {
            target: { value: "Taxi" },
        });
        fireEvent.change(screen.getByTestId("amount"), {
            target: { value: "40" },
        });
        fireEvent.change(screen.getByTestId("datepicker"), {
            target: { value: "2025-07-01" },
        });
        fireEvent.change(screen.getByTestId("vat"), {
            target: { value: "70" },
        });
        fireEvent.change(screen.getByTestId("pct"), {
            target: { value: "20" },
        });
        fireEvent.change(screen.getByTestId("commentary"), {
            target: { value: "un commentaire random" },
        });

        // Ajout d'un fichier .jpg valide
        const fileInput = screen.getByTestId("file");
        const file = new File(["dummy content"], "test.jpg", {
            type: "image/jpeg",
        });
        fireEvent.change(fileInput, {
            target: { files: [file] },
        });

        // Soumettre le formulaire
        const form = screen.getByTestId("form-new-bill");
        fireEvent.submit(form);

        // Attente de la promesse et assertions
        await new Promise(process.nextTick); // force l'attente des promesses

        // Vérifie que les fonctions store ont bien été appelées
        expect(mockStore.bills().create).toHaveBeenCalled();
        expect(mockStore.bills().update).toHaveBeenCalled();

        // Vérifie que la navigation a bien eu lieu
        expect(window.location.hash).toBe(`#${ROUTES_PATH.Bills}`);
    });
});*/
