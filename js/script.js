class Grid{

    constructor(difficulty){

        this.BOMBS = 16;
        this.soundManager = new SoundManager();

        //Creo le righe della matrice
        this.cell = new Array(parseInt(difficulty));
        
        //Creo le colonne della matrice
        for(let i = 0; i < this.cell.length; i++)
            this.cell[i] = new Array(parseInt(difficulty));

        //Creo le singole celle della matrice
        this.cellNum = 0;
        for(let i = 0; i < this.cell.length; i++)
            for(let i2 = 0; i2 < this.cell[i].length; i2++){
                this.cell[i][i2] = new Cell();
                this.cellNum++;
            }

        this.#setBombs();
    }

    #setBombs(){

        let bombsPlaced = 0;
        while(bombsPlaced < this.BOMBS){
            let idSorted = Math.floor(Math.random() * this.cellNum);
            let idIndex = 0, placed = false;
            for(let i = 0; i < this.cell.length && !placed; i++){
                for(let i2 = 0; i2 < this.cell[i].length && !placed; i2++){
                    if(idIndex == idSorted){
                        if(!this.cell[i][i2].hasBomb){
                            this.cell[i][i2].hasBomb = true;
                            bombsPlaced++;
                            this.#setBombsTouched(i, i2);
                        }
                        placed = true;
                    }
                    idIndex++;
                }
            }
        }
    }

    #setBombsTouched(indexRow, indexCol){

        if(indexRow == 0){
            if(indexCol == 0){ //Angolo alto a sinistra
                this.cell[indexRow][indexCol + 1].bombsTouched++;
                this.cell[indexRow + 1][indexCol].bombsTouched++;
                this.cell[indexRow + 1][indexCol + 1].bombsTouched++;
            }
            else if(indexCol == this.cell[indexRow].length - 1){ //Angolo alto destra
                this.cell[indexRow][indexCol - 1].bombsTouched++;
                this.cell[indexRow + 1][indexCol].bombsTouched++;
                this.cell[indexRow + 1][indexCol - 1].bombsTouched++;
            }
            else{ //Prima riga
                this.cell[indexRow][indexCol - 1].bombsTouched++;
                this.cell[indexRow][indexCol + 1].bombsTouched++;
                this.cell[indexRow + 1][indexCol - 1].bombsTouched++;
                this.cell[indexRow + 1][indexCol].bombsTouched++;
                this.cell[indexRow + 1][indexCol + 1].bombsTouched++;
            }
        }
        else if(indexRow == this.cell.length - 1){
            if(indexCol == 0){ //Angolo basso sinistra
                this.cell[indexRow][indexCol + 1].bombsTouched++;
                this.cell[indexRow - 1][indexCol].bombsTouched++;
                this.cell[indexRow - 1][indexCol + 1].bombsTouched++;
            }
            else if(indexCol == this.cell[indexRow].length - 1){ //Angolo basso destra
                this.cell[indexRow][indexCol - 1].bombsTouched++;
                this.cell[indexRow - 1][indexCol].bombsTouched++;
                this.cell[indexRow - 1][indexCol - 1].bombsTouched++;
            }
            else{ //Ultima riga
                this.cell[indexRow][indexCol - 1].bombsTouched++;
                this.cell[indexRow][indexCol + 1].bombsTouched++;
                this.cell[indexRow - 1][indexCol - 1].bombsTouched++;
                this.cell[indexRow - 1][indexCol].bombsTouched++;
                this.cell[indexRow - 1][indexCol + 1].bombsTouched++;
            }
        }
        else{
            if(indexCol == 0){ //Prima colonna
                this.cell[indexRow][indexCol + 1].bombsTouched++;
                this.cell[indexRow - 1][indexCol].bombsTouched++;
                this.cell[indexRow - 1][indexCol + 1].bombsTouched++;
                this.cell[indexRow + 1][indexCol].bombsTouched++;
                this.cell[indexRow + 1][indexCol + 1].bombsTouched++;
            }
            else if(indexCol == this.cell[indexRow].length - 1){ //Ultima colonna
                this.cell[indexRow][indexCol - 1].bombsTouched++;
                this.cell[indexRow - 1][indexCol].bombsTouched++;
                this.cell[indexRow - 1][indexCol - 1].bombsTouched++;
                this.cell[indexRow + 1][indexCol].bombsTouched++;
                this.cell[indexRow + 1][indexCol - 1].bombsTouched++;
            }
            else{ //Tutte le celle interne
                this.cell[indexRow][indexCol - 1].bombsTouched++;
                this.cell[indexRow][indexCol + 1].bombsTouched++;
                this.cell[indexRow - 1][indexCol - 1].bombsTouched++;
                this.cell[indexRow - 1][indexCol].bombsTouched++;
                this.cell[indexRow - 1][indexCol + 1].bombsTouched++;
                this.cell[indexRow + 1][indexCol - 1].bombsTouched++;
                this.cell[indexRow + 1][indexCol].bombsTouched++;
                this.cell[indexRow + 1][indexCol + 1].bombsTouched++;
            }
        }
    }

    draw(){

        for(let i = 0; i < this.cell.length; i++){

            let row = document.createElement("div");
            row.classList.add("d-flex");

            for(let i2 = 0; i2 < this.cell[i].length; i2++)
                this.cell[i][i2].draw(row);
            document.getElementsByTagName("main")[0].appendChild(row);
        }
    }

    drawGameOver(){
        
        this.removeCells();

        for(let i = 0; i < this.cell.length; i++){

            for(let i2 = 0; i2 < this.cell[i].length; i2++){

                if(this.cell[i][i2].hasBomb && !this.cell[i][i2].element.classList.contains("al-bomb"))
                    this.cell[i][i2].element.classList.add("al-bomb");
                else if(!this.cell[i][i2].hasBomb && this.cell[i][i2].element.classList.contains("al-bomb"))
                    this.cell[i][i2].element.classList.add("al-cross-mark");

                if(this.cell[i][i2].active){
                    this.cell[i][i2].active = false;
                    this.cell[i][i2].element.classList.remove("al-active");
                }

            }
        }

        let mex = document.createElement("div");
        mex.innerHTML = `<img src="./img/game-over.svg" alt="game-over" class="al-game-mex">`
        mex.classList.add("al-mex");
        mex.addEventListener("click", () => {setup(true);});

        document.getElementsByTagName("main")[0].appendChild(mex);
    }

    drawVictory(){

        this.removeCells();

        let mex = document.createElement("div");
        mex.innerHTML = `<img src="./img/victory.svg" alt="victory" class="al-game-mex">`
        mex.classList.add("al-mex");
        mex.addEventListener("click", () => {setup(true);});

        document.getElementsByTagName("main")[0].appendChild(mex);
    }

    removeCells(){

        for(let i = 0; i < this.cell.length; i++)
            for(let i2 = 0; i2 < this.cell[i].length; i2++)
                this.cell[i][i2].removeCell();
    }
}





class Cell{

    constructor(){

        this.listener;
        this.bombsTouched = 0;
        this.hasBomb = false;
        this.active = true;
        this.element = document.createElement("div");
    }

    draw(row){

        this.element.classList.add("al-cell");
        
        if(this.active){
            this.element.classList.add("al-active");

            this.element.addEventListener("mousedown", this.listener = ((e) => {this.#interactCell(e)}), false);
        }
        row.appendChild(this.element);
    }

    #interactCell(e){
        
        switch(e.button){
            case 0: //Left click
            
                if(this.hasBomb){
                    grid.soundManager.stop();
                    grid.soundManager.play("game over");
                    grid.drawGameOver();
                }
                else{
                    grid.soundManager.play("cell cleared");
                    switch(this.bombsTouched){

                        case 0: 
                            this.element.classList.add("al-0");
                            break;

                        case 1: 
                            this.element.classList.add("al-1");
                            break;

                        case 2: 
                            this.element.classList.add("al-2");
                            break;

                        case 3: 
                            this.element.classList.add("al-3");
                            break;

                        case 4:
                            this.element.classList.add("al-4");
                            break;

                        default:
                            this.element.classList.add("al-default");
                    }
                    grid.soundManager.play("cell cleared");
                    this.element.textContent = this.bombsTouched;
                    this.removeCell();
                    grid.cellNum--;

                    if(grid.cellNum == grid.BOMBS){
                        grid.soundManager.stop();
                        grid.soundManager.play("victory");
                        grid.drawVictory();
                    }
                }
                break;
    
            case 2: //Right click

                if(this.element.classList.contains("al-bomb")){
                    grid.soundManager.play("question mark placed")
                    this.element.classList.remove("al-bomb");
                    this.element.classList.add("al-question-mark");
                }
                else if(this.element.classList.contains("al-question-mark")){
                    grid.soundManager.play("cell reset")
                    this.element.classList.remove("al-question-mark");
                }
                else{
                    grid.soundManager.play("bomb placed");
                    this.element.classList.add("al-bomb");
                }

                break;
        }
    }

    removeCell(){
        this.element.classList.remove("al-active");
        this.element.removeEventListener("mousedown", this.listener, false);
    }
}




class Sound{

    constructor(url, volume){

        this.track = new Audio(url);
        this.track.volume  = volume;
    }

    play(){
        this.track.play();
    }

    stop(){
        this.track.pause();
    }
}





class SoundManager{

    constructor(){

        this.sound = [];
        
        this.sound.push(new Sound("./sound/cell-cleared.wav", 0.9));
        this.sound.push(new Sound("./sound/bomb-placed.wav", 0.9));
        this.sound.push(new Sound("./sound/question-mark-placed.wav", 0.4));
        this.sound.push(new Sound("./sound/cell-reset.wav", 0.3));
        this.sound.push(new Sound("./sound/victory.wav", 0.8));
        this.sound.push(new Sound("./sound/game-over.wav", 0.8));
        this.sound.push(new Sound("./sound/new-game.wav", 0.8));

    }

    play(soundToPlay){
        
        switch(soundToPlay){

            case "cell cleared":
                this.sound[0].play();
                break;

            case "bomb placed":
                this.sound[1].play();
                break;

            case "question mark placed":
                this.sound[2].play();
                break;
    
            case "cell reset":
                this.sound[3].play();
                break;

            case "victory":
                this.sound[4].play();
                break;
        
            case "game over":
                this.sound[5].play();
                break;

            case "new game":
                this.sound[6].play();
                break;

            default:
                console.log("Class Sound: Errore. Comando non riconosciuto");
        }
    }

    stop(){
        for(let i = 0; i < this.sound.length; i++)
            this.sound[i].stop();
    }
}






//Script
let submit = document.getElementById("submit");
submit.addEventListener("click", () => {setup(true)});
let grid;

setup(false);

function setup(playSound){

    if(playSound)
        grid.soundManager.stop();

    document.getElementsByTagName("main")[0].innerHTML = "";
    grid = new Grid(document.getElementsByTagName("select")[0].value);
    grid.draw();

    if(playSound)
        grid.soundManager.play("new game");
}