const fruits = [
    "🍎", "🍌", "🍊", "🍉", "🍓",
    "🍇", "🍍", "🥭", "🍒", "🍑"
];

const resetEmoji = "❌"
/*
cons spinTimes = [3, 5, 7]  // Število različnih slik pred končno izbiro
*/ 

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;  //random num
}

document.getElementById("spin-button").addEventListener("click", spin) //tukaj sem nastavil listenerja ki poslusa kdaj je ghumb kliknjen


let isButtonDisabled = false;

document.getElementById("spin-button").addEventListener("click", function() {
    if (isButtonDisabled) return; // Prevent the button from being clicked if it's disabled

    // Disable the button
    isButtonDisabled = true;
    this.disabled = true;

    // Add a delay of 2 seconds (2000 milliseconds)
    setTimeout(function() {
        // Re-enable the button after the delay
        document.getElementById("spin-button").disabled = false;
        isButtonDisabled = false; // Dopusti da je gumb spet pritisnjen
    }, 500);  // 2000ms = 2 sekundi
});




/*
document.getElementById("reset-button").addEventListener("click", reset)
*/
function spin() {

    
    let spin1 = fruits[getRandomNumber(0, fruits.length - 1)]  //tukaj se shrani mesto v seznamu
    document.getElementById("spinner1").innerHTML = spin1

    let spin2 = fruits[getRandomNumber(0, fruits.length - 1)]  //tukaj se shrani mesto v seznamu
    document.getElementById("spinner2").innerHTML = spin2

    let spin3 = fruits[getRandomNumber(0, fruits.length - 1)]  //tukaj se shrani mesto v seznamu
    document.getElementById("spinner3").innerHTML = spin3




    //  let seznamDobitkov = [spin1, spin2, spin3]

    if (spin1 === spin2 && spin2 === spin3) {                    //preverja ce so veriabli enaki
        console.log("JACKPOT");  //ZA TESTIRANJE
        document.getElementById("rezultat-box").innerHTML = "JACKPOT!"
        iztreliKonfete();
    } else if (spin1 === spin2 || spin1 === spin3 || spin2 === spin3) {
        console.log("DVOJČEK");  //ZA TESTIRANJE
        document.getElementById("rezultat-box").innerHTML = "DVOJČEK"
    } else {
        console.log("POSKUSI ŠE ENKRAT");  //ZA TESTIRANJE
        document.getElementById("rezultat-box").innerHTML = "POSKUSI ŠE ENKRAT"
        //iztreliKonfete(); //ZA TEST
    }

    console.log("spinner")
}

//Funkcija za konfete
function iztreliKonfete() {
    confetti({
        particleCount: 150,  // Število konfetnih delcev
        spread: 200,          // Razpršenost
        origin: { y: 0.6 }   // Kje se sproži
    });
}


function reset() {
    document.getElementById("spinner1").innerHTML = resetEmoji

    document.getElementById("spinner2").innerHTML = resetEmoji

    document.getElementById("spinner3").innerHTML = resetEmoji
}