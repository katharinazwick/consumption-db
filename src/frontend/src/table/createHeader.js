const divContainer = document.getElementById("container");
divContainer.className ="headerContainer";
Object.assign(divContainer.style,
    {
        display: "flex",
        flexDirection: "rows",
    })

const temp = ["title", "viewing year", "stream", "description", "options"];
const widths = ["50%", "10%", "10%", "20%", "10%"];

temp.forEach((element, index) => {
    const divHeaders = document.createElement("div");
    divHeaders.className = "childHeaders"
    divHeaders.innerText = element;
    divHeaders.style.height= "30px";
    divHeaders.style.padding= "2px";
        divHeaders.style.width = widths[index];
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