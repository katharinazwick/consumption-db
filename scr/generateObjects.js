import {datas} from "./datas.js";
import {getDatasFromPopup} from "./getDatasFromPopup.js";

let consumptions = {
    movie: {}, //alernativ mit array aber mal sehen
    serie: {},
};

const consumption = getDatasFromPopup();
console.log("sing",consumption)
if (consumption.typ === "movie"){
    consumptions.movie[consumption.title] = {...consumption};
} else {
    consumptions.serie[consumption.title] = {...consumption};
}
console.log("plu",consumptions)



//const consumptionArr = datas();  // Nimmt an, dass `datas()` ein Array von Arrays zurückgibt.


/*for (let i = 0; i < consumptionArr.length; i++) {
    consumption.title = consumptionArr[i][0];
    consumption.stream = consumptionArr[i][1];
    consumption.typ = consumptionArr[i][2];
    consumption.others = consumptionArr[i][3];
    consumption.date = consumptionArr[i][4];
    if (consumption.typ === "movie") {
        consumptions.movie[consumption.title] = {...consumption};
    } else {
        consumptions.serie[consumption.title] = {...consumption};
    }
}*/

/*export function generateAndSort() {
    for (let category in consumptions) {
        if (consumptions.hasOwnProperty(category)) {
            consumptions[category] = Object.keys(consumptions[category])
                .sort() // Alphabetische Sortierung der Schlüssel
                .reduce((obj, key) => {
                    obj[key] = consumptions[category][key]; // Baue das sortierte Objekt
                    return obj;
                }, {});
        }
    }
    return consumptions;
}*/


