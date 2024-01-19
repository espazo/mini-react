function createTextNode(text) {
    return {
        type: "TEXT_ELEMENT", props: {
            nodeValue: text, children: [],
        },
    };
}

function createElement(type, props, ...children) {
    return {
        type, props: {
            ...props, children: children.map((child) => {
                const isTextNode = typeof child === "string" || typeof child === "number";
                return isTextNode ? createTextNode(child) : child;
            }),
        },
    }
}

function render(el, container) {
    wipRoot = {
        dom: container, props: {
            children: [el],
        },
    };
    nextWorkOfUnit = wipRoot;
    wipRoot.alternate = wipRoot;
}

let wipRoot = null;
const deletions = [];
let nextWorkOfUnit = null;

function workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
        if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
            nextWorkOfUnit = null;
        }
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

        if (task.effectTag === "update") {
            updateProps(task.dom, task.props, task.alternate?.props);
        } else if (task.effectTag === "placement") {
            if (task.dom) {
                taskParent.dom.append(task.dom);
            }
        }
        recursion(task.child);
        recursion(task.sibling);
    }

    deletions.forEach(commitDeletion);
    deletions.length = 0;

    recursion(wipRoot.child);
}

function commitDeletion(fiber) {
    if (fiber.dom) {
        let fiberParent = fiber.parent;
        while (!fiberParent.dom) {
            fiberParent = fiberParent.parent;
        }
        fiberParent.dom.removeChild(fiber.dom);
    } else {
        commitDeletion(fiber.child);
    }
}

function createDom(type) {
    return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
    Object.keys(prevProps).forEach((key) => {
        if (key !== "children") {
            if (!(key in nextProps)) {
                dom.removeAttribute(key);
            }
        }
    });

    Object.keys(nextProps).forEach((key) => {
        if (key !== "children") {
            if (nextProps[key] !== prevProps[key]) {
                if (key.startsWith("on")) {
                    const eventType = key.slice(2).toLowerCase();
                    dom.removeEventListener(eventType, prevProps[key]);
                    dom.addEventListener(eventType, nextProps[key]);
                } else {
                    dom[key] = nextProps[key];
                }
            }
        }
    });
}

function reconcileChildren(fiber, children) {
    let oldFiber = fiber.alternate?.child;
    let prevChild = null;
    children.forEach((child, index) => {
        const isSameType = oldFiber && oldFiber.type === child.type;
        let newFiber;
        if (isSameType) {
            newFiber = {
                type: child.type,
                props: child.props,
                child: null,
                parent: fiber,
                sibling: null,
                dom: oldFiber.dom,
                effectTag: "update",
                alternate: oldFiber,
            };
        } else {
            if (child) {
                newFiber = {
                    type: child.type,
                    props: child.props,
                    child: null,
                    parent: fiber,
                    sibling: null,
                    dom: null,
                    effectTag: "placement",
                };
            }

            if (oldFiber) {
                deletions.push(oldFiber);
            }
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevChild.sibling = newFiber;
        }
        if (newFiber) {
            prevChild = newFiber;
        }
    });

    while (oldFiber) {
        deletions.push(oldFiber);
        oldFiber = oldFiber.sibling;
    }
}

let wipFiber = null;

function updateFunctionComponent(fiber) {
    stateHooks = [];
    stateHookIndex = 0;
    wipFiber = fiber;

    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = fiber.dom = createDom(fiber.type);

        // fiber.parent.dom.append(dom);

        updateProps(dom, fiber.props, {});
    }

    const children = fiber.props.children;
    reconcileChildren(fiber, children);
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

function update() {
    const currentFiber = wipFiber;

    return () => {
        wipRoot = {
            ...currentFiber, alternate: currentFiber,
        };
        nextWorkOfUnit = wipRoot;
        requestIdleCallback(workLoop);
    }
}

let stateHooks;
let stateHookIndex;

function useState(initial) {
    let currentFiber = wipFiber;
    const oldHost = currentFiber.alternate?.stateHooks[stateHookIndex];
    const stateHook = {
        state: oldHost ? oldHost.state : initial,
        queue: oldHost ? oldHost.queue : [],
    };

    stateHook.queue.forEach((action) => {
        stateHook.state = action(stateHook.state);
    });

    stateHook.queue = [];

    stateHookIndex += 1;
    stateHooks.push(stateHook);
    console.log(stateHookIndex, stateHooks);

    currentFiber.stateHooks = stateHooks;

    function setState(action) {
        // stateHook.state = action(stateHook.state);
        stateHook.queue.push(typeof action === "function" ? action : () => action);
        wipRoot = {
            ...currentFiber,
            alternate: currentFiber,
        }

        nextWorkOfUnit = wipRoot;
        requestIdleCallback(workLoop);
    }

    return [stateHook.state, setState];
}

const React = {
    render, createElement, update, useState,
};

export default React;
