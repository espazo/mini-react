import React from "./core/React.js";

let count = 0;
let props = {id: "a1234"};

function Counter({num}) {

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

function CounterContainer() {
    return <Counter/>;
}

function App() {
    return <Counter num={20}/>;
}

console.log(App);

export default App;
