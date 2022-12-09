class CustomSelect {

    #id;
    #options;
    #currentSelectedOption;
    #selectDropdownList;

    constructor(id, options) {
        this.#id = id;
        this.#options = options;
        this.#currentSelectedOption = null;
        this.#selectDropdownList = null;
    }

    get selectedValue() {
        return this.#currentSelectedOption
    }

    #dropdownTemplate(element, options, parent) {
        const el = document.createElement(element);
        options.class.forEach(cl => el.classList.add(cl));
        if (options.text)
            el.textContent = options.text;
        if (options.data)
            el.dataset[options.data.name] = options.data.value;
        if (parent)
            Array.from(document.querySelectorAll(parent)).at(-1).append(el);
        else
            return el;
    }

    render(container) {
        container.append(this.#dropdownTemplate("div", {
            class: ["select-dropdown", `select-dropdown--${this.#id}`]
        }));
        this.#dropdownTemplate("button", {
            class: ["select-dropdown__button", `select-dropdown__button--${this.#id}`]
        }, ".select-dropdown");
        this.#dropdownTemplate("span", {
            class: ["select-dropdown__text", `select-dropdown__text--${this.#id}`],
            text: "Выберите элемент"
        }, ".select-dropdown__button");
        this.#dropdownTemplate("ul", {
            class: ["select-dropdown__list", `select-dropdown__list--${this.#id}`]
        }, ".select-dropdown");
        this.#options.forEach(i => this.#dropdownTemplate("li", {
            class: ["select-dropdown__list-item"],
            data: {
                name: "value",
                value: i.value
            },
            text: i.text
        }, ".select-dropdown__list"));
        this.#selectDropdownList = document.querySelector(".select-dropdown__list");
        this.#openingClosinglist();
    }

    #openingClosinglist() {
        document.querySelector(".select-dropdown__button")
            .addEventListener("click", () => {
                this.#selectDropdownList.classList.toggle("active");
            });
        this.#selectingElementList();
    }

    #selectingElementList() {
        this.#selectDropdownList.addEventListener("click", event => {
            const isSelectedItem = event.target.closest(".select-dropdown__list-item");
            if (isSelectedItem) {
                this.#currentSelectedOption = this.#options.filter(i => i.value === Number(isSelectedItem.dataset.value));
                const [{text}] = this.#currentSelectedOption;
                document.querySelector(".select-dropdown__text").textContent = text;
                this.#backlightSwitchSelectingItem(isSelectedItem);
            }
        });
    }

    #backlightSwitchSelectingItem(selectedItem) {
        this.#selectDropdownList.childNodes.forEach(node => {
            if (node.classList.contains("selected"))
                node.classList.toggle("selected");
        });
        selectedItem.classList.toggle("selected");
    }
}


const options = [
    {value: 1, text: 'JavaScript'},
    {value: 2, text: 'NodeJS'},
    {value: 3, text: 'ReactJS'},
    {value: 4, text: 'HTML'},
    {value: 5, text: 'CSS'}
];

const customSelect = new CustomSelect('123', options);
const mainContainer = document.querySelector('#container');
customSelect.render(mainContainer);
console.log("Возворащаем customSelect.selectedValue ", customSelect.selectedValue);