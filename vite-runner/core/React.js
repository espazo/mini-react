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
                const isTextNode = typeof child === "string" || typeof child === "number";
                return isTextNode
                    ? createTextNode(child)
                    : child;
            }),
        },
    }
}

function render(el, container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el],
        },
    };
    root = nextWorkOfUnit;
}

let root = null;
let nextWorkOfUnit = null;

function workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
        shouldYield = deadline.timeRemaining() < 1;
    }

    if (nextWorkOfUnit == null) {
        commitUI();
    } else {
        requestIdleCallback(workLoop);
    }
}

function commitUI() {
    function recursion(task) {
        if (task == null) {
            return;
        }

        let taskParent = task.parent;
        while (!taskParent.dom) {
            taskParent = taskParent.parent;
        }

        if (task.dom) {
            taskParent.dom.append(task.dom);
        }
        recursion(task.child);
        recursion(task.sibling);
    }

    recursion(root.child);
}

function createDom(type) {
    return type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(type);
}

function updateProps(dom, props) {
    Object.keys(props).forEach((key) => {
        if (key !== "children") {
            dom[key] = props[key];
        }
    });
}

function initChildren(fiber, children) {
    let prevChild = null;
    children.forEach((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            parent: fiber,
            sibling: null,
            dom: null,
        }
        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevChild.sibling = newFiber;
        }
        prevChild = newFiber;
    });
}

function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)];
    initChildren(fiber, children);
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = fiber.dom = createDom(fiber.type);

        // fiber.parent.dom.append(dom);

        updateProps(dom, fiber.props);
    }

    const children = fiber.props.children;
    initChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
    const isFunctionComponent = typeof fiber.type === "function";
    if (isFunctionComponent) {
        updateFunctionComponent(fiber);
    } else {
        updateHostComponent(fiber);
    }

    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}

requestIdleCallback(workLoop);

const React = {
    render,
    createElement,
};

export default React;
