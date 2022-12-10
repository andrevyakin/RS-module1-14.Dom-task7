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
        if (
            //Container не DOM Element или не передан при вызове
            !(container instanceof Element)
            //Id не число
            || isNaN(this.#id)
            //Option не массив
            || !Array.isArray(this.#options)
            //Option.value не уникален, или не число
            || this.#options.map(i => i.value)
                .filter((item, index, array) => isNaN(item) || array.indexOf(Number(item)) !== index).length
            //Option.text отсуствует
            || this.#options.filter(i => !i.text).length) {
            document.querySelector(".container__title").textContent = "Что-то пошло не так."
            return
        }
        this.#dropdownTemplate(container);
        this.#selectDropdownList = document.querySelector(".select-dropdown__list");
        this.#listenList(document.querySelector(".select-dropdown__button"), this.#toggleUl);
        this.#listenList(this.#selectDropdownList, this.#processSelection);
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

    #toggleUl() {
        this.#selectDropdownList.classList.toggle("active");
    }

    #toggleLi(selectedItem) {
        this.#selectDropdownList.childNodes.forEach(node => {
            if (node.classList.contains("selected"))
                node.classList.toggle("selected");
        });
        selectedItem.classList.toggle("selected");
    }

    #processSelection(event) {
        const isSelectedItem = event.target.closest(".select-dropdown__list-item");
        if (isSelectedItem) {
            this.#currentSelectedOption = this.#options.find(i => i.value === Number(isSelectedItem.dataset.value));
            document.querySelector(".select-dropdown__text").textContent = this.#currentSelectedOption.text;
            this.#toggleLi(isSelectedItem);
            this.#toggleUl();
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

