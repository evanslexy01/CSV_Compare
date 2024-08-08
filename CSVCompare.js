//Takes in CSV - returns 2D array and headers
function CSVtoArray(CSVString) {
    const rows = CSVString.toLowerCase().split("\n")
    const CSVArray = [];
    for (let i=0; i < rows.length; i++) {
        rowArray = rows[i].split(/,(?=(?:[^"]*"[^"]*")*(?![^"]*"))/);
        rowArray.forEach((value) => {
            value = value.trim();
        });
        CSVArray.push(rowArray);
    }
    const headers = CSVArray.shift();
    return CSVArray, headers;
}

//Adds corresponding header to each value in row
tableArray.forEach((row) => {
    row.forEach((_,index) => {
        row[index] = `${headerArray[index]}_${row[index]}`;
    })
})

const primarySheet = new Map();

const primaryTableArray = [];
const primaryHeaderMatchArray = [];
const primaryHeaders = [];

const secondaryTableArray = [];
const secondaryHeaderMatchArray = [];
const secondaryHeaders = [];

primaryTableArray.forEach((row) => {
    let mapKey = "";
    row.forEach((value, index) => {
        if (primaryHeaderMatchArray.includes(index)) {
            mapKey = mapKey ? mapKey + `_${value}` : value;
        }
        row[index] = `${primaryHeaders[index]}_${row[index]}`
    });
    if (primarySheet.has(mapKey)) {
        let updatedMapValue = primarySheet.get(mapKey);
        row.forEach((value, index) => {
            updatedMapValue.push(row[index]);
        });
        updatedMapValue = updatedMapValue.filter((value,index) => updatedMapValue.indexOf(value) === index);
        primarySheet.set(mapKey, updatedMapValue);
    } else {
        primarySheet.set(mapKey, row)
    }
});

secondaryTableArray.forEach((row) => {
        let mapKey = "";
    row.forEach((value, index) => {
        if (secondaryHeaderMatchArray.includes(index)) {
            mapKey = mapKey ? mapKey + `_${value}` : value;
        }
        row[index] = `${secondaryHeaders[index]}_${row[index]}`
    });
    //Does not add new spots, only performing left join
    if (primarySheet.has(mapKey)) {
        let updatedMapValue = primarySheet.get(mapKey);
        row.forEach((value, index) => {
            updatedMapValue.push(row[index]);
        });
        updatedMapValue = updatedMapValue.filter((value,index) => updatedMapValue.indexOf(value) === index);
        primarySheet.set(mapKey, updatedMapValue);
    };
});

//Combines headers and removes duplicates
fullHeaderArray = primaryHeaders.concat(secondaryHeaders).filter((value, index) => fullHeaderArray.indexOf(value) === index);

//Holds CSV in array form for export
const exportCSVArray = [...fullHeaderArray];

//Goes through map object and get all values per header for an entry, combines them with ; if there are multiple, pushes to export csv
primarySheet.forEach((value, key) => {
    fullHeaderArray.forEach((header) => {
        let splitStringArray = value.filter((element) => element.includes(header));
        let splitStringArray2 = [];
        splitStringArray.forEach((entry, index) => {
            splitStringArray2.push(entry.split("_")[1])
        })
        exportCSVArray.push(splitStringArray2.join("; "))
    })
})

//Turns export array into string for CSV export
exportCSVString = exportCSVArray.join();