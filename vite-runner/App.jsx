import React from "./core/React.js";

let count = 0;
let props = {id: "a1234"};

function TestUpdateProps() {

    function handleClick() {
        console.log("click");
        count += 1;
        props = {style: "color: red;"};
        React.update();
    }

    return <div {...props}>
        Counter: {count}
        <button onClick={handleClick}>click</button>
    </div>;
}

let showBar = false;
function Counter() {

    const foo = <div>
        foo
        <div>child 1</div>
        <div>child 2</div>
    </div>;

    const bar = <div>
        bar
    </div>;

    function handleShowBar() {
        showBar = !showBar;
        React.update();
    }

    return (
        <div>
            Counter
            <div>{showBar ? foo : bar}</div>
            <button onClick={handleShowBar}>showBar</button>
        </div>
    );
}

function CounterContainer() {
    return <Counter/>;
}

function App() {
    return <Counter/>;
}

export default Counter;
