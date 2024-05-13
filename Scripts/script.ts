
// export your functions or variables here
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars

const numberOfLetters = 5;

const sidenote:HTMLElement =<HTMLElement> document.getElementById('sidenote');


let wordsCSV:string[][] =  [["","",""]];

const filePath:string = '../HTML/words.csv';




async function loadCSV(_path: string): Promise<string[][]> {
    const response = await fetch(_path);
    const csvData:string = await response.text();
   
    return new Promise<string[][]>((resolve, reject) => {
        Papa.parse(csvData, {
            header: false,
            complete: (result) => {
                resolve(result.data as string[][]);
                return result.data as string[][];
            },
            error: (error: Papa.ParseError) => {
                reject(error.message);
            },
        });
    });
}

async function getWordsCSV(): Promise<void> {
    wordsCSV = await loadCSV(filePath);
    console.log(wordsCSV);
}

function getRandomWords(): string[][] {
    const randomWords: string[][] = [];
    
    while (randomWords.length < 3) {
        const  randomIndex = Math.floor(Math.random() * wordsCSV.length);
        randomWords.push(wordsCSV[randomIndex]);
    }
    
    
    return randomWords;
}



console.log("Hello World");

enum Status {
    Correct = 'correct',
    DifferentPlace = 'different place',
    Wrong = 'wrong',
    None = 'none'
}

class Letter {
    letter: string;
    status: Status;
    
    constructor(letter: string, status: Status) {
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
}

//create function that makes a 5x6 matrix of letters and initialises them with empty values
function createMatrix(): Letter[][] {
    const matrix: Letter[][] = [];
    for (let i = 0; i < 5; i++) {
        matrix[i] = [];
        for (let j = 0; j < numberOfLetters; j++) {
            matrix[i][j] = new Letter('',Status.None);
        }
    }
    return matrix;
}

// Use the function
const matrix = createMatrix();
console.log(matrix);

// find the html table element with the id 'table'
const grid =document.getElementById('wordl_grid');


let currentRow:number = 0;

const hintButton = document.getElementById('hintButton');


hintButton.addEventListener('click', () => {
    if (sidenote.style.display === 'none') {
        sidenote.style.display = 'flex';
    } else {
        sidenote.style.display = 'none';
    }
});

//create a function that takes in a matrix and creates a table with that matrix, create a new table inside the table div element
function createTable(matrix: Letter[][]): HTMLTableElement {
    const table:HTMLTableElement =document.createElement('table');
    let inputs: HTMLInputElement[] = [];
    for (let i = 0; i < 5; i++) {
        const row = table.insertRow(i);
        for (let j = 0; j < numberOfLetters; j++) {
            const cell = row.insertCell(j);
            const input = document.createElement('input');
            cell.appendChild(input);
            input.value = matrix[i][j].letter;
            input.setAttribute('maxlength', '1');
            input.addEventListener('input', function() {
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


let table:HTMLTableElement = createTable(matrix);


//make a function that disables the input cells of a row of the table
function disableRow(_row: number,_table:HTMLTableElement): void {
    for (let i = 0; i < numberOfLetters; i++) {
        const input = _table.rows[_row].cells[i].children[0] as HTMLInputElement;
        input.disabled = true;
    }
}


// make an init function that disables all rows of the table except the first one
function initTable(_table:HTMLTableElement): void {
    for (let i = 1; i < 5; i++) {
        disableRow(i,_table);
    }
}

//make a function that disables all rows of the table
function disableTable(_table:HTMLTableElement): void {
    for (let i = 0; i < 5; i++) {
        disableRow(i,_table);
    }
}





//const button:HTMLButtonElement =<HTMLButtonElement> document.getElementById('submitBtn');
let words:string[][] = [[]];
async function main():Promise<void>{
    
    await getWordsCSV();
    initTable(table); 
    words= getRandomWords();
    console.log(words);
    // add eventlistener if someone presses enter
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            submit();
        }
    });
    sidenote.innerHTML = words[currentWordIndex][1];
}

main();

function getAmountOfLetters(_word: string,_letter: string): number {
    let count = 0;
    for (let j = 0; j < _word.length; j++) {
        if (_word[j] === _letter) {
            count++;
        }
    }
    return count;
}

let won:boolean = false;


//function to get 3 random words from the wordcsv (with their category) and put them in an array, without repeating a word (not the same index)








let currentWordIndex:number = 0;




function checkIfNoneEmpty(_row: number,_table:HTMLTableElement): boolean {
    for (let i = 0; i < numberOfLetters; i++) {
        const input = _table.rows[_row].cells[i].children[0] as HTMLInputElement;
        if (input.value === '') {
            return false;
        }
    }
    return true;
}


//make a function that checks if the input of a row is correct, check letter for letter, use the word as a parameter
async function checkRow(_row: number,_table:HTMLTableElement,_Searchword:string): Promise<boolean> {
    console.log(words);
    if (!checkIfNoneEmpty(_row,_table)) {
        toastr.error('Please fill in all the letters');
        return false;
    }
    console.log(_Searchword);
    
    
    
    for (let i = 0; i < numberOfLetters; i++) {
        const input = _table.rows[_row].cells[i].children[0] as HTMLInputElement;
        
        
        // check if input value is a char that's somewhere in the searchword
        
        if (_Searchword.includes(input.value)) {
            matrix[_row][i].letter = input.value;
            
            
            
            if (input.value === _Searchword[i]) {
                input.classList.add('correct');
                matrix[_row][i].status = Status.Correct;
            } else {
                
                
                const amountOfLetters = getAmountOfLetters(_Searchword,input.value);
                
                let previousCount = 0;
                
                for(let j = 0; j < i; j++){
                    if((_table.rows[_row].cells[j].children[0] as HTMLInputElement).value === input.value){
                        previousCount++;
                    }
                }
                
                
                if(previousCount < amountOfLetters){
                    //opposite of previousCount
                    let nextCountCorrect = 0;
                    for(let j = i; j < _Searchword.length; j++){
                        if((_table.rows[_row].cells[j].children[0] as HTMLInputElement).value === input.value&&(_table.rows[_row].cells[j].children[0] as HTMLInputElement).value === _Searchword[j]){
                            nextCountCorrect++;
                        }
                    }
                    if(nextCountCorrect < amountOfLetters){
                        input.classList.add('differentPlace');
                        matrix[_row][i].status = Status.DifferentPlace;
                    }else{
                        input.classList.add('wrong');
                    }  
                }else{
                    input.classList.add('wrong');
                }
            }
        } else {
            input.classList.add('wrong');
            matrix[_row][i].status = Status.Wrong;
        }
        //after each letter wait for 1s before checking the next letter, so the user can see all animate in after eachother
        await delay(150);    
        
    }
    
    for (let i = 0; i < numberOfLetters; i++) {
        if( matrix[_row][i].status != Status.Correct){
            
            return true;
        }
        
        
    }
    disableTable(_table);
    won = true;
    
    toastr.success("Correct! The word was: "+_Searchword+"!");
    
    console.log(matrix);
    
    reset();
    
    
}


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



//add event listener to the button
//button.addEventListener('click', submit);




async function submit():Promise<void>{
    console.log(words[currentWordIndex][0]);
    
    let notempty:boolean = await checkRow(currentRow,table,words[currentWordIndex][0]);
    if(!notempty){
        return;
    }
    if(won){
        return;
    }
    disableRow(currentRow,table);
    currentRow++;
    nextRow(table);
    //change to the next input field
    const input = table.rows[currentRow].cells[0].children[0] as HTMLInputElement;
    input.focus();
}

//nextrow , unblock the next row of the table except if its the last row
function nextRow(_table:HTMLTableElement): void {
    if (currentRow < 5) {
        for (let i = 0; i < numberOfLetters; i++) {
            const input = _table.rows[currentRow].cells[i].children[0] as HTMLInputElement;
            input.disabled = false;
        }
    }else
    {
        reset();
    }
}

function setProgress(level:number) {
    const progress = document.getElementById('progress');
    progress.style.width = (level / 3) * 100 + '%';
}

// Call this function with the current level to update the progress bar



async function reset():Promise<void>{
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
    if(currentWordIndex < words.length-1){
        await delay(2100);
        currentWordIndex++;
        setProgress(currentWordIndex);
        const input = table.rows[currentRow].cells[0].children[0] as HTMLInputElement;
        input.focus();
        sidenote.innerHTML = words[currentWordIndex][1];
        
    }else{
        setProgress(3);
        toastr.success('You have completed the game!');
    }
    
    
}


function deleteTable():void{
    grid.removeChild(table);
    table = createTable(matrix);
    initTable(table);
}




