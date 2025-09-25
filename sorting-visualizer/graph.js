const GRAPH_TYPES = [
    "bubble",
    "selection",
    "insertion",
    "merge",
    "quick",
    "heap",
]

var stop = false;
var randomGraphs = true;

function initArray(length=16) {
    let arr = [];
    for (let i = 0; i < length; i++) {
        if (randomGraphs) arr.push(Math.floor(Math.random() * length) + 1);
        else arr.push(i + 1);
    }
    // shuffle the array
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function drawGraph(graph, length=16) {
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
        elementSlider.min = 5;
        elementSlider.max = 1000;
        elementSlider.step = 1;
        elementSlider.value = 16;
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

async function done(graph) {
    let bars = graph.children;
    let speed = 500 / bars.length;
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = "var(--bar-color)";
    }
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = "var(--sorted-color)";
        await delay(speed);
    }
}

// https://en.wikipedia.org/wiki/Bubble_sort
async function bubbleSort(graph) {
    stop = false;
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
    done(graph);
}

// https://www.geeksforgeeks.org/dsa/selection-sort-algorithm-2/
async function selectionSort(graph) {
    stop = false;
    let arr = graph.children;
    let n = arr.length;
    let speed = 2000 / n;
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        arr[min_idx].style.backgroundColor = "var(--selected-color)";
        for (let j = i + 1; j < n; j++) {
            arr[j].style.backgroundColor = "var(--selected-color)";
            await delay(speed);
            if (stop) {
                stop = false;
                return;
            }
            arr[j].style.backgroundColor = "var(--bar-color)";
            if (parseFloat(arr[j].style.height) < parseFloat(arr[min_idx].style.height)) {
                arr[min_idx].style.backgroundColor = "var(--bar-color)";
                min_idx = j;
                arr[min_idx].style.backgroundColor = "var(--selected-color)";
            }
        }
        swap(arr, i, min_idx);
        arr[i].style.backgroundColor = "var(--sorted-color)";
        arr[min_idx].style.backgroundColor = "var(--bar-color)";
        await delay(speed);
        if (stop) {
            stop = false;
            return;
        }
    }
    done(graph);
}


// https://en.wikipedia.org/wiki/Insertion_sort 
async function insertionSort(graph) {
    stop = false;
    let A = graph.children;
    let n = A.length;
    let speed = 2000 / n;
    let i = 1;
    while (i < n) {
        let j = i;
        while(j > 0 && parseFloat(A[j - 1].style.height) > parseFloat(A[j].style.height)) {
            A[j].style.backgroundColor = "var(--selected-color)";
            A[j - 1].style.backgroundColor = "var(--selected-color)";
            await delay(speed);
            if (stop) {
                stop = false;
                return;
            }
            swap(A, j, j - 1);
            await delay(speed);
            if (stop) {
                stop = false;
                return;
            }
            j = j - 1;
            A[j].style.backgroundColor = "var(--bar-color)";
            A[j + 1].style.backgroundColor = "var(--bar-color)";
        }
        i = i + 1;
    }
    done(graph);
}

async function mergeSort(graph) {
    stop = false;
    let g = graph.children;
    await mergeSortHelper(g, 0, g.length);
    await done(graph);
}

async function mergeSortHelper(g, start, end) {
    if (end - start <= 1) return;

    let mid = Math.floor((start + end) / 2);

    await mergeSortHelper(g, start, mid);
    await mergeSortHelper(g, mid, end);

    await merge(g, start, mid, end);
}

async function merge(g, start, mid, end) {
    let leftHeights = [];
    for (let i = start; i < mid; i++) leftHeights.push(parseFloat(g[i].style.height));
    let rightHeights = [];
    for (let i = mid; i < end; i++) rightHeights.push(parseFloat(g[i].style.height));

    let i = 0, j = 0, k = start;
    let speed = 4000 / g.length;

    while (i < leftHeights.length && j < rightHeights.length) {
        g[k].style.backgroundColor = "var(--selected-color)";
        await delay(speed);
        if (stop) { stop = false; return; }

        if (leftHeights[i] <= rightHeights[j]) {
            g[k].style.height = leftHeights[i] + "%";
            i++;
        } else {
            g[k].style.height = rightHeights[j] + "%";
            j++;
        }

        g[k].style.backgroundColor = "var(--bar-color)";
        k++;
    }

    while (i < leftHeights.length) {
        g[k].style.backgroundColor = "var(--selected-color)";
        await delay(speed);
        if (stop) { stop = false; return; }
        g[k].style.height = leftHeights[i] + "%";
        g[k].style.backgroundColor = "var(--bar-color)";
        i++;
        k++;
    }

    while (j < rightHeights.length) {
        g[k].style.backgroundColor = "var(--selected-color)";
        await delay(speed);
        if (stop) { stop = false; return; }
        g[k].style.height = rightHeights[j] + "%";
        g[k].style.backgroundColor = "var(--bar-color)";
        j++;
        k++;
    }
}

async function quickSort(graph) {
    stop = false;
    let g = graph.children;
    quickSortHelper(g, 0, g.length - 1).then(() => {
        done(graph);
    });
}

async function quickSortHelper(g, low, high) {
    if (low < high) {
        let pi = await partition(g, low, high);
        await quickSortHelper(g, low, pi - 1);
        await quickSortHelper(g, pi + 1, high);
    }
}

async function partition(g, low, high) {
    let pivot = parseFloat(g[high].style.height);
    g[high].style.backgroundColor = "var(--pivot-color)";
    let i = low - 1;
    let speed = 4000 / g.length;

    for (let j = low; j < high; j++) {
        g[j].style.backgroundColor = "var(--selected-color)";
        await delay(speed);
        if (stop) { stop = false; return; }

        if (parseFloat(g[j].style.height) < pivot) {
            i++;
            swap(g, i, j);
            g[i].style.backgroundColor = "var(--bar-color)";
        }
        g[j].style.backgroundColor = "var(--bar-color)";
    }
    swap(g, i + 1, high);
    g[high].style.backgroundColor = "var(--bar-color)";
    g[i + 1].style.backgroundColor = "var(--bar-color)";
    return i + 1;
}

async function heapSort(graph) {
    stop = false;
    let g = graph.children;
    let n = g.length;
    let speed = 4000 / n;

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(g, n, i, speed);
    }

    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        swap(g, 0, i);
        g[i].style.backgroundColor = "var(--sorted-color)";
        await delay(speed);
        if (stop) { stop = false; return; }
        await heapify(g, i, 0, speed);
    }
    g[0].style.backgroundColor = "var(--sorted-color)";
    await done(graph);
}

async function heapify(g, n, i, speed) {
    let largest = i; // Initialize largest as root
    let l = 2 * i + 1; // left = 2*i + 1
    let r = 2 * i + 2; // right = 2*i + 2

    // If left child is larger than root
    if (l < n) {
        g[l].style.backgroundColor = "var(--selected-color)";
        g[largest].style.backgroundColor = "var(--selected-color)";
        await delay(speed);
        if (stop) { stop = false; return; }
        if (parseFloat(g[l].style.height) > parseFloat(g[largest].style.height)) {
            largest = l;
        }
        g[l].style.backgroundColor = "var(--bar-color)";
        g[i].style.backgroundColor = "var(--bar-color)";
    }

    // If right child is larger than largest so far
    if (r < n) {
        g[r].style.backgroundColor = "var(--selected-color)";
        g[largest].style.backgroundColor = "var(--selected-color)";
        await delay(speed);
        if (stop) { stop = false; return; }
        if (parseFloat(g[r].style.height) > parseFloat(g[largest].style.height)) {
            largest = r;
        }
        g[r].style.backgroundColor = "var(--bar-color)";
        g[i].style.backgroundColor = "var(--bar-color)";
    }

    // If largest is not root
    if (largest != i) {
        swap(g, i, largest);
        await delay(speed);
        if (stop) { stop = false; return; }
        await heapify(g, n, largest, speed);
    }
}

function arrayToString(arr) {
    str = "[";
    for (bar of arr) {
        str += parseFloat(bar.style.height) + ", ";
    }
    return str.slice(0, -2) + "]";
}

function main() {
    generatGraphsHTML();
}

main();
