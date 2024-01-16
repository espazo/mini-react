const log = console.log;

function createDOM(type) {
    switch (type) {
        case "TEXT_ELEMENT":
            return document.createTextNode("");
        default:
            return document.createElement(type);
    }
}

function render(vDOM, rDOM) {
    task = {
        type: vDOM.type,
        props: vDOM.props,
        parent: {
            dom: rDOM,
        },
    };
    rootTask = task;
}

function createElement(type, props, ...children) {
    function createTextNode(text) {
        return {
            type: "TEXT_ELEMENT",
            props: {
                children: [],
                nodeValue: text,
            },
        };
    }

    function createChildNode(node) {
        const type = typeof node;
        if (type === "string" || type === "number") {
            return createTextNode(node);
        } else {
            return node;
        }
    }

    return {
        type: type,
        props: {
            ...props,
            children: children.map(createChildNode),
        },
    };
}

function doTask(task) {
    const isFunctionComponent = typeof task.type === "function";

    if (!isFunctionComponent) {
        task.dom = createDOM(task.type);
        Object.keys(task.props).forEach((key) => {
            if (key !== "children") {
                task.dom[key] = task.props[key];
            }
        });
    } else {
        task.props.children = [task.type(task.props)];
    }

    let prevTask = null;
    task.props.children.forEach((child, index) => {
        const nTask = {
            parent: task,
            type: child.type,
            props: child.props,
        };

        if (index === 0) {
            task.child = nTask;
        } else {
            prevTask.sibling = nTask;
        }
        prevTask = nTask;
    });

    if (task.child) {
        return task.child;
    }

    let sibling = task;
    while (sibling) {
        if (sibling.sibling) {
            return sibling.sibling;
        }
        sibling = sibling.parent;
    }

    return null;
}

let task = null;
let rootTask = null;

function commitUI() {
    function recursion(task) {
        if (task == null) {
            return;
        }

        let taskParent = task.parent;
        while (taskParent && !taskParent.dom) {
            taskParent = taskParent.parent;
        }
        if (task.dom) {
            taskParent.dom.appendChild(task.dom);
        }
        recursion(task.child);
        recursion(task.sibling);
    }

    recursion(rootTask);
}

function IdleRequestCallBack(IdleDeadline) {
    let isContinue = true;
    while (isContinue && task) {
        task = doTask(task);
        isContinue = IdleDeadline.timeRemaining() > 1;
    }

    if (task) {
        requestIdleCallback(IdleRequestCallBack);
    } else {
        commitUI();
    }
}

requestIdleCallback(IdleRequestCallBack);

export default {
    createElement,
    render,
};
