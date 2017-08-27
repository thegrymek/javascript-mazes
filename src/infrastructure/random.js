let BOOLEANS = [true, false];


function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function random_range(start, end) {
    if (end === undefined) {
        end = start;
        start = 0;
    }

    return start + Math.floor(Math.random()*(end - start));
}


function random_choice(collection) {
    let random_idx = Math.floor(Math.random()*collection.length);
    return collection[random_idx];
}


function random_index_choice(collection) {
    return Math.floor(Math.random()*collection.length);;
}


function random_boolean() {
    return random_choice(BOOLEANS);
}