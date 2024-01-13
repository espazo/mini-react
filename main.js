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
            children,
        },
    }
}

const textEl = createTextNode("app");
const App = createElement("div", {id: "app"}, textEl);

const dom = document.createElement(App.type);
dom.id = App.props.id;

document.querySelector("#root").appendChild(dom);

const textNode = document.createTextNode("");
textNode.nodeValue = App.props.children[0].props.nodeValue;

dom.appendChild(textNode);
