import React from "./core/React.js";

function Counter({num}) {
    function handleClick() {
        console.log("click");
    }

    return <div>
        Counter: {num}
        <button onClick={handleClick}>click</button>
    </div>;
}

function CounterContainer() {
    return <Counter/>;
}

function App() {
    return <div>
        你好，世界
        <Counter num={10}/>
        <Counter num={20}/>
    </div>;
}

export default App;
