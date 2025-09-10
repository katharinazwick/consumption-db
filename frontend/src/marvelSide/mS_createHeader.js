const divContainer = document.getElementById("window");
divContainer.className ="headerContainer";
Object.assign(divContainer.style,
    {
        display: "flex",
        flexDirection: "rows",
    })

const temp = ["position", "title", "universum", "year", "options"];

temp.forEach((element) => {
    const divHeaders = document.createElement("div");
    divHeaders.className = "childHeaders"
    divHeaders.innerText = element;
    divHeaders.style.height= "30px";
    divHeaders.style.padding= "2px";
    if (element === "title") {
        divHeaders.style.width = "40%";
    } else if (element === "positon") {
        divHeaders.style.width = "10%";
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
})