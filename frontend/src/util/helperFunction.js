/* 8) removePossibleDoubleValues(reallyUniqueArray, arrayWithPossibleDoubles)
  
  let indexesOfDoubleValue; should be added to the global scope!

  This function is used to remove possible double values in the titles arrays:
    - titles
    - ochtendTitles
    - middagTitles
    - avondTitles

    We use the unique array to compare the values, and splice them from the titles arrays if neccesary

    we remove doubles this way, to preserve the upper and lower cases of the original titles:
    Tom & Jerry
    De Nog Grotere Slijmfilm
    Fien & Teun: Het Grote Dierenfeest
    De Croods 2: Een Nieuw Begin
    Fast & Furious 9
    Black Widow
    Space Jam A New Legacy (NL)

    ipv:
    pieter konijn op de vlucht
    tom & jerry
    de nog grotere slijmfilm
    fien & teun: het grote dierenfeest
    de croods 2: een nieuw begin
    fast & furious 9
    black widow
    space jam a new legacy (nl)
  */
let indexesOfDoubleValue;
export function removePossibleDoubleValues(reallyUniqueArray, arrayWithPossibleDoubles) {
  // console.log(arrayWithPossibleDoubles);
  for (let el of reallyUniqueArray) {
    for (let val of arrayWithPossibleDoubles) {
      indexesOfDoubleValue = arrayWithPossibleDoubles.reduceRight(function (
        a,
        currentValue,
        index,
      ) {
        if (removeWhiteSpace(currentValue) === removeWhiteSpace(el)) {
          a.push(index);
        }
        return a;
      },
      []);
    }
    if (indexesOfDoubleValue.length > 1) {
      indexesOfDoubleValue.map((el, i) => {
        if (i > 0) {
          arrayWithPossibleDoubles.splice(el, 1);
        }
      });
    }
  }
}

// 9) ADD TIMES ARRAYS AND CONVERT TO OBJECT:
/* convert arrays with unique titles to objects, and add the startTimes, and endTimes array fields: 
    [
      0: {title: "Pieter Konijn", startTimes: [], endTimes: []}
      1: {title: "Tom & Jerry", startTimes: [], endTimes: []}
      2: {title: "De Croods", startTimes: [], endTimes: []}
    ]
  */
export const addTimesArrays = uniqueArray =>
  uniqueArray.map((el, i, array) => (array[i] = { title: el, startTimes: [], endTimes: [] }));

// 10) COMBINE START TIMES AND ADD ID
/* Every time film.title matches unique film title, add the start time to the unique film times array, also add ID
  [
      0: {
          id: "10087691",
          title: "Pieter Konijn", 
          startTimes: ["13:00"],
          endTimes: ["14:15"]
        }
      1: {
          id: "10087693",
          title: "Tom & Jerry", 
          startTimes: ["13:00"],
          endTimes: ["14:15"]

        }
      2: {
          id: "10087643",
          title: "De Croods", 
          startTimes: ["13:00", "15:45"],
          endTimes: ["14:15", "17:03"]
        }
    ] 
  */

// Combineert de starttijden van een film die "dubbel" draait, bijvoorbeeld om 19:00 en om 21:30
export const combineStartTimes = (filmsArray, uniqueArray) => {
  for (let film of filmsArray) {
    for (let el of uniqueArray) {
      if (removeWhiteSpace(film.title) === removeWhiteSpace(el.title)) {
        uniqueArray[uniqueArray.indexOf(el)].id = film.id;
        // Check if the start time already exists for the current movie: 19:30 | 19:30. if it does, return ...times, else add the start time
        uniqueArray[uniqueArray.indexOf(el)].startTimes.includes(film.start)
          ? (uniqueArray[uniqueArray.indexOf(el)].startTimes = [
              ...uniqueArray[uniqueArray.indexOf(el)].startTimes,
            ])
          : (uniqueArray[uniqueArray.indexOf(el)].startTimes = [
              ...uniqueArray[uniqueArray.indexOf(el)].startTimes,
              film.start,
            ]);
      }
    }
  }
};

// Combineert de eindtijden van een film die "dubbel" draait, en die bijvoorbeeld eindigt om 21:30 en om 00:23
export const combineEndTimes = (filmsArray, uniqueArray) => {
  for (let film of filmsArray) {
    for (let el of uniqueArray) {
      if (removeWhiteSpace(film.title) === removeWhiteSpace(el.title)) {
        // Check if the end time already exists for the current movie: 19:30 | 19:30. if it does, return ...times, else add the end time
        uniqueArray[uniqueArray.indexOf(el)].endTimes.includes(film.end)
          ? (uniqueArray[uniqueArray.indexOf(el)].endTimes = [
              ...uniqueArray[uniqueArray.indexOf(el)].endTimes,
            ])
          : (uniqueArray[uniqueArray.indexOf(el)].endTimes = [
              ...uniqueArray[uniqueArray.indexOf(el)].endTimes,
              film.end,
            ]);
      }
    }
  }
};

// 11) RESORT ARRAY - FOR IF ORDER CHANGED BECAUSE OF removePossibleDoubleValues()
export function SortArray(array) {
  array.sort((a, b) => {
    return a.startTimes[0] < b.startTimes[0] ? -1 : a.startTimes[0] > b.startTimes[0] ? 1 : 0;
  });
}

export const removeWhiteSpace = string => string.replace(/\s+/g, ' ').trim().toLowerCase();
