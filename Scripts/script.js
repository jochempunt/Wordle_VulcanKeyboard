"use strict";
// export your functions or variables here
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const numberOfLetters = 5;
const sidenote = document.getElementById('sidenote');
let wordsCSV = [["", "", ""]];
const filePath = '../HTML/words.csv';
function loadCSV(_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(_path);
        const csvData = yield response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(csvData, {
                header: false,
                complete: (result) => {
                    resolve(result.data);
                    return result.data;
                },
                error: (error) => {
                    reject(error.message);
                },
            });
        });
    });
}
function getWordsCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        wordsCSV = yield loadCSV(filePath);
        console.log(wordsCSV);
    });
}
function getRandomWords() {
    const randomWords = [];
    while (randomWords.length < 3) {
        const randomIndex = Math.floor(Math.random() * wordsCSV.length);
        randomWords.push(wordsCSV[randomIndex]);
    }
    return randomWords;
}
console.log("Hello World");
var Status;
(function (Status) {
    Status["Correct"] = "correct";
    Status["DifferentPlace"] = "different place";
    Status["Wrong"] = "wrong";
    Status["None"] = "none";
})(Status || (Status = {}));
class Letter {
    constructor(letter, status) {
        this.letter = letter;
        this.status = status;
    }
}
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "timeOut": 2000,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
//create function that makes a 5x6 matrix of letters and initialises them with empty values
function createMatrix() {
    const matrix = [];
    for (let i = 0; i < 5; i++) {
        matrix[i] = [];
        for (let j = 0; j < numberOfLetters; j++) {
            matrix[i][j] = new Letter('', Status.None);
        }
    }
    return matrix;
}
// Use the function
const matrix = createMatrix();
console.log(matrix);
// find the html table element with the id 'table'
const grid = document.getElementById('wordl_grid');
let currentRow = 0;
const hintButton = document.getElementById('hintButton');
hintButton.addEventListener('click', () => {
    if (sidenote.style.display === 'none') {
        sidenote.style.display = 'flex';
    }
    else {
        sidenote.style.display = 'none';
    }
});
//create a function that takes in a matrix and creates a table with that matrix, create a new table inside the table div element
function createTable(matrix) {
    const table = document.createElement('table');
    let inputs = [];
    for (let i = 0; i < 5; i++) {
        const row = table.insertRow(i);
        for (let j = 0; j < numberOfLetters; j++) {
            const cell = row.insertCell(j);
            const input = document.createElement('input');
            cell.appendChild(input);
            input.value = matrix[i][j].letter;
            input.setAttribute('maxlength', '1');
            input.addEventListener('input', function () {
                this.value = this.value.replace(/[^a-zA-Z]/g, '');
            });
            inputs.push(input);
        }
    }
    // Add event listener to each input to move focus to next input on input
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            // Check if input value is an alphabetic character
            if (input.value.match(/[a-zA-Z]/)) {
                // If it is, and there's a next input field, move focus to the next input field
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });
    });
    grid.appendChild(table);
    return table;
}
let table = createTable(matrix);
//make a function that disables the input cells of a row of the table
function disableRow(_row, _table) {
    for (let i = 0; i < numberOfLetters; i++) {
        const input = _table.rows[_row].cells[i].children[0];
        input.disabled = true;
    }
}
// make an init function that disables all rows of the table except the first one
function initTable(_table) {
    for (let i = 1; i < 5; i++) {
        disableRow(i, _table);
    }
}
//make a function that disables all rows of the table
function disableTable(_table) {
    for (let i = 0; i < 5; i++) {
        disableRow(i, _table);
    }
}
//const button:HTMLButtonElement =<HTMLButtonElement> document.getElementById('submitBtn');
let words = [[]];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield getWordsCSV();
        initTable(table);
        words = getRandomWords();
        console.log(words);
        // add eventlistener if someone presses enter
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                submit();
            }
        });
        sidenote.innerHTML = words[currentWordIndex][1];
    });
}
main();
function getAmountOfLetters(_word, _letter) {
    let count = 0;
    for (let j = 0; j < _word.length; j++) {
        if (_word[j] === _letter) {
            count++;
        }
    }
    return count;
}
let won = false;
//function to get 3 random words from the wordcsv (with their category) and put them in an array, without repeating a word (not the same index)
let currentWordIndex = 0;
function checkIfNoneEmpty(_row, _table) {
    for (let i = 0; i < numberOfLetters; i++) {
        const input = _table.rows[_row].cells[i].children[0];
        if (input.value === '') {
            return false;
        }
    }
    return true;
}
//make a function that checks if the input of a row is correct, check letter for letter, use the word as a parameter
function checkRow(_row, _table, _Searchword) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(words);
        if (!checkIfNoneEmpty(_row, _table)) {
            toastr.error('Please fill in all the letters');
            return false;
        }
        console.log(_Searchword);
        for (let i = 0; i < numberOfLetters; i++) {
            const input = _table.rows[_row].cells[i].children[0];
            // check if input value is a char that's somewhere in the searchword
            if (_Searchword.includes(input.value)) {
                matrix[_row][i].letter = input.value;
                if (input.value === _Searchword[i]) {
                    input.classList.add('correct');
                    matrix[_row][i].status = Status.Correct;
                }
                else {
                    const amountOfLetters = getAmountOfLetters(_Searchword, input.value);
                    let previousCount = 0;
                    for (let j = 0; j < i; j++) {
                        if (_table.rows[_row].cells[j].children[0].value === input.value) {
                            previousCount++;
                        }
                    }
                    if (previousCount < amountOfLetters) {
                        //opposite of previousCount
                        let nextCountCorrect = 0;
                        for (let j = i; j < _Searchword.length; j++) {
                            if (_table.rows[_row].cells[j].children[0].value === input.value && _table.rows[_row].cells[j].children[0].value === _Searchword[j]) {
                                nextCountCorrect++;
                            }
                        }
                        if (nextCountCorrect < amountOfLetters) {
                            input.classList.add('differentPlace');
                            matrix[_row][i].status = Status.DifferentPlace;
                        }
                        else {
                            input.classList.add('wrong');
                        }
                    }
                    else {
                        input.classList.add('wrong');
                    }
                }
            }
            else {
                input.classList.add('wrong');
                matrix[_row][i].status = Status.Wrong;
            }
            //after each letter wait for 1s before checking the next letter, so the user can see all animate in after eachother
            yield delay(150);
        }
        for (let i = 0; i < numberOfLetters; i++) {
            if (matrix[_row][i].status != Status.Correct) {
                return true;
            }
        }
        disableTable(_table);
        won = true;
        toastr.success("Correct! The word was: " + _Searchword + "!");
        console.log(matrix);
        reset();
    });
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//add event listener to the button
//button.addEventListener('click', submit);
function submit() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(words[currentWordIndex][0]);
        let notempty = yield checkRow(currentRow, table, words[currentWordIndex][0]);
        if (!notempty) {
            return;
        }
        if (won) {
            return;
        }
        disableRow(currentRow, table);
        currentRow++;
        nextRow(table);
        //change to the next input field
        const input = table.rows[currentRow].cells[0].children[0];
        input.focus();
    });
}
//nextrow , unblock the next row of the table except if its the last row
function nextRow(_table) {
    if (currentRow < 5) {
        for (let i = 0; i < numberOfLetters; i++) {
            const input = _table.rows[currentRow].cells[i].children[0];
            input.disabled = false;
        }
    }
    else {
        reset();
    }
}
function setProgress(level) {
    const progress = document.getElementById('progress');
    progress.style.width = (level / 3) * 100 + '%';
}
// Call this function with the current level to update the progress bar
function reset() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(matrix);
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < numberOfLetters; j++) {
                matrix[i][j].letter = '';
                matrix[i][j].status = Status.None;
            }
        }
        currentRow = 0;
        won = false;
        deleteTable();
        if (currentWordIndex < words.length - 1) {
            yield delay(2100);
            currentWordIndex++;
            setProgress(currentWordIndex);
            const input = table.rows[currentRow].cells[0].children[0];
            input.focus();
            sidenote.innerHTML = words[currentWordIndex][1];
        }
        else {
            setProgress(3);
            toastr.success('You have completed the game!');
        }
    });
}
function deleteTable() {
    grid.removeChild(table);
    table = createTable(matrix);
    initTable(table);
}
