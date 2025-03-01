const divContainer = document.getElementById("container");
Object.assign(divContainer.style,
    {
        display: "flex",
        flexDirection: "rows",
    })

const temp = ["title", "viewing year", "stream"];

for (let i = 0; i < temp.length; i++) {
    const divHeaders = document.createElement("div");
    divHeaders.className = "childHeaders"
    divHeaders.innerText = temp[i];
    divHeaders.id = temp[i];
    divHeaders.style.height= "30px";
    if (i === 0) {
        divHeaders.style.width = "60%";
    } else {
        divHeaders.style.width = "20%";
    }
    Object.assign(divHeaders.style, {
        border: "1px solid grey",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        color: "grey",
    });
    divContainer.appendChild(divHeaders);
}