import React from "./core/React.js";

function Counter({num}) {
    return <div>Counter: {num}</div>;
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
