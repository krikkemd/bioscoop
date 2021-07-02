// 8) ADD TIMES ARRAY AND CONVERT TO OBJECT:
/* convert arrays with unique titles to objects, and add times array field: 
    [
      0: {title: "Pieter Konijn", times: []}
      1: {title: "Tom & Jerry", times: []}
      2: {title: "De Croods", times: []}
    ]
  */
export const addTimesArray = uniqueArray =>
  uniqueArray.map((el, i, array) => (array[i] = { title: el, times: [] }));

// 9) COMBINE START TIMES AND ADD ID
/* Every time film.title matches unique film title, add the start time to the unique film times array, also add ID
  [
      0: {
          id: "10087691",
          title: "Pieter Konijn", 
          times: ["13:00"]
        }
      1: {
          id: "10087693",
          title: "Tom & Jerry", 
          times: ["13:00"]
        }
      2: {
          id: "10087643",
          title: "De Croods", 
          times: ["13:00", "15:45"]
        }
    ] 
  */
export const combineStartTimes = (filmsArray, uniqueArray) => {
  for (let film of filmsArray) {
    for (let el of uniqueArray) {
      if (film.title === el.title) {
        uniqueArray[uniqueArray.indexOf(el)].id = film.id;
        uniqueArray[uniqueArray.indexOf(el)].times = [
          ...uniqueArray[uniqueArray.indexOf(el)].times,
          film.start,
        ];
      }
    }
  }
};
