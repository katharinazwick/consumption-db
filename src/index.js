const response = await fetch("http://localhost:3000/get-entries");
const data = await response.json();

import {loadData} from "./outputTable.js";
import {sort} from "./sortData.js";

loadData(data, "stream", "all");

const incomplete = document.getElementById("incomplete");

const chooseStream = document.getElementById("chooseStream");
chooseStream.addEventListener("change", function () {
    loadData(data, chooseStream.value, incomplete.value);
});

incomplete.addEventListener("change", function () {
    loadData(data, chooseStream.value, incomplete.value);
});

const sortValue = document.getElementById("sort");
sortValue.addEventListener("change", function () {
    sort(data, sortValue.value);
    loadData(data,chooseStream.value, incomplete.value);
})
