class CustomSelect {
    #id;
    #options;
    #currentSelectedOption;
    #selectDropdownList;

    constructor(id, options) {
        this.#id = id;
        this.#options = options;
    }

    get selectedValue() {
        if (this.#currentSelectedOption)
            return this.#currentSelectedOption;
        else
            return "Объект не выбран.";
    }

    render(container) {
        try {
            this.#dataValidation(container);
        } catch (e) {
            document.querySelector(".container__title").textContent = "Что-то пошло не так.";
            console.error(e);
            return;
        }
        this.#dropdownTemplate(container);
        this.#selectDropdownList = document.querySelector(".select-dropdown__list");
        this.#listenList(document.querySelector(".select-dropdown__button"), this.#toggleList);
        this.#listenList(this.#selectDropdownList, this.#processSelection);
    }

    #dataValidation(container) {
        if (!(container instanceof Element))
            throw new Error("container не DOM Element или не передан.");
        if (isNaN(this.#id))
            throw new Error("Id не число.");
        if (!Array.isArray(this.#options))
            throw new Error("Options не массив.");
        if (this.#options.map(i => i.value)
            .filter((item, index, array) => isNaN(item)
                || array.indexOf(Number(item)) !== index).length)
            throw new Error("Option.value не число, или не уникально.");
        if (this.#options.filter(i => !i.text).length)
            throw new Error("Option.text отсуствует.");
    }

    #dropdownTemplate(container) {
        container.append(this.#createElement("div", {
            class: ["select-dropdown", `select-dropdown--${this.#id}`]
        }));
        this.#createElement("button", {
            class: ["select-dropdown__button", `select-dropdown__button--${this.#id}`]
        }, ".select-dropdown");
        this.#createElement("span", {
            class: ["select-dropdown__text", `select-dropdown__text--${this.#id}`],
            text: "Выберите элемент"
        }, ".select-dropdown__button");
        this.#createElement("ul", {
            class: ["select-dropdown__list", `select-dropdown__list--${this.#id}`]
        }, ".select-dropdown");
        this.#options.forEach(i => this.#createElement("li", {
            class: ["select-dropdown__list-item"],
            data: {
                name: "value",
                value: i.value
            },
            text: i.text
        }, ".select-dropdown__list"));
    }

    #createElement(element, options, parent) {
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

    #listenList(htmlElement, callback) {
        htmlElement.addEventListener("click", callback.bind(this));
    }

    #toggleList() {
        this.#selectDropdownList.classList.toggle("active");
    }

    #toggleChildNodesList() {
        this.#selectDropdownList.childNodes.forEach(node => {
            if (node.classList.contains("selected"))
                node.classList.toggle("selected");
        });
    }

    #processSelection(event) {
        const isSelectedItem = event.target.closest(".select-dropdown__list-item");
        if (isSelectedItem) {
            this.#currentSelectedOption = this.#options.find(i => i.value === Number(isSelectedItem.dataset.value));
            document.querySelector(".select-dropdown__text").textContent = this.#currentSelectedOption.text;
            this.#toggleChildNodesList();
            isSelectedItem.classList.toggle("selected");
            this.#toggleList();
        }
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

