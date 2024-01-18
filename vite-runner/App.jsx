import React from "./core/React.js";

const log = console.log;


let countFoo = 0;

function Foo() {
    log("render Foo()");
    const update = React.update();

    function handleClick() {
        countFoo += 1;
        update();
    }

    return <div>
        foo count: {countFoo}
        <button onClick={handleClick}>click foo</button>
    </div>;
}

let countBar = 0;

function Bar() {
    log("render Bar()");
    const update = React.update();

    function handleClick() {
        countBar += 1;
        update();
    }

    return <div>
        bar count: {countBar}
        <button onClick={handleClick}>click bar</button>
    </div>;
}

let countRoot = 0;

function App() {
    log("render App()");
    const update = React.update();

    function handleClick() {
        countRoot += 1;
        update();
    }

    return <div>
        app count: {countRoot}
        <button onClick={handleClick}>click app</button>
        <Foo/>
        <Bar/>
    </div>;
}

export default App;
