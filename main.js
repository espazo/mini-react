
const dom = document.createElement("div");
dom.id = "app";

document.querySelector("#root").appendChild(dom);

const textNode = document.createTextNode("");
textNode.nodeValue = "app";

dom.appendChild(textNode);
