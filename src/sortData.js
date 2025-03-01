export function sort(array, sortValue) {
    if (sortValue === "viewing Year ascending") {
        array.sort((a, b) => a.viewingyear - b.viewingyear);
    } else if (sortValue === "viewing Year descending") {
        array.sort((a, b) => b.viewingyear - a.viewingyear);
    }
}