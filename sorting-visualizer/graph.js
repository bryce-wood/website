var length = 4; // how many elements are in the array (how many bars in the graph)
var array; // the array to be sorted
var graph = document.getElementById("template-graph");

function initArray() {
    array = [];
    for (let i = 0; i < length; i++) {
        array.push(Math.floor(Math.random() * length) + 1);
    }
}

function drawGraph() {
    graph.replaceChildren(); // clear the graph
    for (bar of array) {
        let barElement = document.createElement("div");
        barElement.style.height = (bar * 100 / length) + "%";
        barElement.style.width = (100 / length) + "%";
        barElement.classList.add("bar");
        graph.appendChild(barElement);
    }
}

function main() {
    initArray();
    console.log(array);
    drawGraph();
}

main();
