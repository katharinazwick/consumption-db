import {loadData} from "./outputTable.js";

loadData("", "", "");

const incomplete = document.getElementById("incomplete");
const chooseTyp = document.getElementById("chooseTyp");
const chooseStream = document.getElementById("chooseStream");

chooseStream.addEventListener("change", function () {
    loadData(chooseStream.value, incomplete.value, chooseTyp.value);
});

incomplete.addEventListener("change", function () {
    loadData(chooseStream.value, incomplete.value, chooseTyp.value);
});

chooseTyp.addEventListener("change", function () {
    loadData(chooseStream.value, incomplete.value, chooseTyp.value);
})

/*const sortValue = document.getElementById("sort");
sortValue.addEventListener("change", function () {
    sort(data, sortValue.value);
    loadData(data,chooseStream.value, incomplete.value,chooseTyp.value);
})*/
