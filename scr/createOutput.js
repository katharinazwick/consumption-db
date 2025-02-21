import {generateAndSort} from "./generateObjects.js";

const consumptions = generateAndSort();
console.log(consumptions.movie);

const divContainer = document.getElementById("container");

for (let keys in consumptions) {

    const divHead = document.createElement('h2');
    divHead.className = "childHead";
    divHead.innerHTML = `<span class="arrow">▶</span> ${keys}`;

    const divHeader = document.createElement("div");
    divHeader.className = "childHeader";

    let temp = ["title", "stream", "others"]

    for (let i = 0; i < temp.length; i++) {
        const divHeaders = document.createElement("div");
        divHeaders.className = "childHeaders"
        divHeaders.innerText = temp[i];
        if (i === 1) {
            divHeaders.style.width = "20%";
        } else {
            divHeaders.style.width = "40%";
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
//dont work!!!!!!!!!!!!!
    divHead.addEventListener('click', () => {
        const isVisible = divHeader.style.display === 'block';
        divHeader.style.display = isVisible ? 'none' : 'block';

        const arrow = divHead.querySelector('.arrow');
        arrow.classList.toggle('rotated', !isVisible);
    });

    const divEnter = document.createElement("p");

    divContainer.appendChild(divHead);
    divContainer.appendChild(divHeader);
    divContainer.appendChild(divEnter);

    for (let key in consumptions[keys]) {
        console.log("aa")
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
            width: "40%",
        });

        const divStream = document.createElement("div");
        divStream.className = "childOthers"
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
            width: "20%",
        });

        const divOthers = document.createElement("div");
        divOthers.className = "childOthers"
        divOthers.innerText = "/";
        if (temp.others) {
            divOthers.innerText = temp.others;
        }
        Object.assign(divOthers.style, {
            border: "1px solid grey",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            textAlign: "center",
            color: "black",
            width: "40%",
        });

        divTable.appendChild(divTitle);
        divTable.appendChild(divStream);
        divTable.appendChild(divOthers);
        divContainer.appendChild(divTable);
        divContainer.appendChild(divEnter);
    }
}