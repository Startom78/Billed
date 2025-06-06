import { ROUTES_PATH } from "../constants/routes.js";

export default class VerticalLayout {
    constructor({ document, onNavigate, localStorage }) {
        this.document = document;
        this.onNavigate = onNavigate;
        this.localStorage = localStorage;
        $("#layout-icon1").click(this.handleClick1);
        $("#layout-icon2").click(this.handleClick2);
    }

    handleClick1 = (e) => {
        this.onNavigate(ROUTES_PATH["Bills"]);
    };

    handleClick2 = (e) => {
        this.onNavigate(ROUTES_PATH["NewBill"]);
    };
}
