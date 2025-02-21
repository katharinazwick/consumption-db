import {datas} from "./datas.js";

let consumptions = {
    movie: {},
    serie: {},
};

let consumption = {};

const consumptionArr = datas();  // Nimmt an, dass `datas()` ein Array von Arrays zurückgibt.


for (let i = 0; i < consumptionArr.length; i++) {
    consumption.title = consumptionArr[i][0];
    consumption.stream = consumptionArr[i][1];
    consumption.typ = consumptionArr[i][2];
    consumption.others = consumptionArr[i][3];
    if (consumption.typ === "movie") {
        consumptions.movie[consumption.title] = {...consumption};
    } else {
        consumptions.serie[consumption.title] = {...consumption};
    }
}

export function generateAndSort() {
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
}

console.log(generateAndSort())


