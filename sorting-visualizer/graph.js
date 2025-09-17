const GRAPH_TYPES = [
    "bubble",
    "selection",
    "insertion",
    "quick",
    "merge",
    "heap",
]

var stop = false;

function initArray(length=10) {
    let arr = [];
    for (let i = 0; i < length; i++) {
        //arr.push(Math.floor(Math.random() * length) + 1);
        arr.push(i + 1);
    }
    // shuffle the array
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function drawGraph(graph, length=10) {
    let array = initArray(length);
    graph.replaceChildren(); // clear the graph
    for (bar of array) {
        let barElement = document.createElement("div");
        barElement.style.height = (bar * 100 / length) + "%";
        barElement.style.width = (100 / length) + "%";
        barElement.classList.add("bar");
        graph.appendChild(barElement);
    }
}

function generatGraphsHTML() {
    for (let type of GRAPH_TYPES) {
        let graphContainer = document.createElement("div");
        graphContainer.id = "graph-" + type;
        graphContainer.classList.add("graph-container");
        
        let title = document.createElement("p");
        title.classList.add("graph-title");
        title.innerText = type.charAt(0).toUpperCase() + type.slice(1) + " Sort";
        graphContainer.appendChild(title);

        let controls = document.createElement("div");
        controls.classList.add("controls");
        let sortButton = document.createElement("button");
        let elementSlider = document.createElement("input");
        let resetButton = document.createElement("button");

        let graph = document.createElement("div");
        graph.classList.add("graph");
        drawGraph(graph);

        sortButton.innerText = "Sort";
        sortButton.onclick = () => {
            console.log("Sorting " + type);
            eval(type + "Sort(graph)");
        }

        elementSlider.type = "range";
        elementSlider.min = 3;
        elementSlider.max = 100;
        elementSlider.step = 1;
        elementSlider.value = 10;
        elementSlider.oninput = (e) => {
            stop = true; // stop the current sorting
            let length = e.target.value;
            drawGraph(graph, length);
        }

        resetButton.innerText = "Reset";
        resetButton.onclick = () => {
            stop = true; // stop the current sorting
            let length = elementSlider.value;
            drawGraph(graph, length);
        }

        controls.appendChild(sortButton);
        controls.appendChild(elementSlider);
        controls.appendChild(resetButton);
        graphContainer.appendChild(controls);
        graphContainer.appendChild(graph);
        document.getElementById("graphs").appendChild(graphContainer);
    }
}

function swap(A, i, j) {
    let tmp = A[i].style.height;
    A[i].style.height = A[j].style.height;
    A[j].style.height = tmp;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// https://en.wikipedia.org/wiki/Bubble_sort
async function bubbleSort(graph) {
    let A = graph.children;
    let n = A.length;
    let speed = 2000 / n; // speed is faster for larger arrays
    while (n > 1) {
        let newn = 0;
        for (let i = 1; i < n; i++) {
            // compare A[i-1] and A[i]
            A[i-1].style.backgroundColor = "var(--selected-color)";
            A[i].style.backgroundColor = "var(--selected-color)";
            // step: compare
            await delay(speed);
            if (stop) {
                stop = false;
                return;
            }
            if (parseFloat(A[i - 1].style.height) > parseFloat(A[i].style.height)) {
                swap(A, i - 1, i);
                // step: swap
                await delay(speed);
                if (stop) {
                    stop = false;
                    return;
                }
                newn = i;
            }
            // no longer comparing
            A[i-1].style.backgroundColor = "var(--bar-color)";
            A[i].style.backgroundColor = "var(--bar-color)";
        }
        for (let i = newn; i < n; i++) {
            A[i].style.backgroundColor = "var(--sorted-color)";
        }
        n = newn;
    }
}

function main() {
    generatGraphsHTML();
}

main();
