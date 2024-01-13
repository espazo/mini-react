function createTextNode(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child === "string"
                    ? createTextNode(child)
                    : child;
            }),
        },
    }
}

const textEl = createTextNode("app");
const App = createElement("div", {id: "app"}, "你好", "世界");

console.log(App);

function render(el, container) {
    const dom = el.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(el.type);

    Object.keys(el.props).forEach((key) => {
        if (key !== "children") {
            dom[key] = el.props[key];
        }
    });

    const children = el.props.children;
    children.forEach((child) => {
        render(child, dom);
    });

    container.append(dom);
}

render(App, document.querySelector("#root"));
