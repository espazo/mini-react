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
    function Foo() {
        return <div>foo</div>;
    }

    function Bar() {
        return <p>bar</p>;
    }

    function handleShowBar() {
        showBar = !showBar;
        React.update();
    }

    return (
        <div>
            Counter
            <div>{showBar ? <Foo/> : <Bar/>}</div>
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

console.log(App);

export default Counter;
