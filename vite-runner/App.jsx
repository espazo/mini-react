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
    const bar = <div>bar</div>;

    function handleShowBar() {
        showBar = !showBar;
        React.update();
    }

    return (
        <div>
            Counter
            {showBar && bar}
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

console.log(Counter.toString());

export default Counter;
