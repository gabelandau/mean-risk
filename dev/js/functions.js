/* This function is used to shuffle the order of an array.
    It is used to randomize order of brothers with the same point value
    so the draft is not the same each time. */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* This function is used to separate the brothers array
    into a draftable and exempt array */
function separateArrays(draftable, exempt) {
    for (var x = 0; x < draftable.length; x++) {
        if (draftable[x].exempt == "Yes") {
            exempt.push(draftable[x]);
            draftable.splice(x, 1);
            separateArrays(draftable, exempt);
        }
    }
    return draftable, exempt;
}

/* This function is used to change the exempt status of brothers
    who are on EC, a senior, or on Co-Op */
function runExemptions(array) {
    for (var x = 0; x < array.length; x++) {
        if (array[x].coop == true || array[x].senior == true || array[x].executive_council == true) {
            array[x].exempt = "Yes";
        } else {
            array[x].exempt = "";
        }
    }
    return array;
}
