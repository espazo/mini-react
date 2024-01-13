import React from "./React.js";

const ReactDOM = {
    createRoot(container) {
        return {
            render(element) {
                React.render(element, container);
            }
        }
    }
};

export default ReactDOM;
