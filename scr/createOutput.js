//import {generateAndSort} from "./generateObjects.js";

//const consumptions = generateAndSort();

const divContainer = document.getElementById("container");

for (let keys in consumptions) {

    const divHead = document.createElement('h2');
    divHead.className = "childHead";
    divHead.innerHTML = `<span class="arrow">▶</span> ${keys}`;

    const divHeader = document.createElement("div");
    divHeader.className = "childHeader";

    let temp = ["title", "stream", "date"]

    for (let i = 0; i < temp.length; i++) {
        const divHeaders = document.createElement("div");
        divHeaders.className = "childHeaders"
        divHeaders.innerText = temp[i];
        if (i === 0) {
            divHeaders.style.width = "50%";
        } else {
            divHeaders.style.width = "25%";
        }
        Object.assign(divHeaders.style, {
            border: "1px solid grey",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            textAlign: "center",
            color: "grey",
        });
        divHeader.appendChild(divHeaders);
    }

    divContainer.appendChild(divHead);
    divContainer.appendChild(divHeader);

    for (let key in consumptions[keys]) {
        const divTable = document.createElement("div");
        divTable.className = "childTable"

        const temp = consumptions[keys][key];

        const divTitle = document.createElement("div");
        divTitle.className = "childTitle"
        divTitle.innerText = temp.title;
        Object.assign(divTitle.style, {
            border: "1px solid grey",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            textAlign: "center",
            color: "black",
            width: "50%",
        });

        const divStream = document.createElement("div");
        divStream.className = "childStream"
        divStream.innerText = "/"
        if (temp.stream) {
            divStream.innerText = temp.stream;
        }
        Object.assign(divStream.style, {
            border: "1px solid grey",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            textAlign: "center",
            color: "black",
            width: "25%",
        });

        const childDate = document.createElement("div");
        childDate.className = "childDate"
        childDate.innerText = "/";
        if (temp.date) {
            childDate.innerText = temp.date;
        }
        Object.assign(childDate.style, {
            border: "1px solid grey",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            textAlign: "center",
            color: "black",
            width: "25%",
        });



        divTable.appendChild(divTitle);
        divTable.appendChild(divStream);
        divTable.appendChild(childDate);
        divContainer.appendChild(divTable);
    }
}