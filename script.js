const fruits = [
    "🍎", "🍌", "🍊", "🍉", "🍓",
    "🍇", "🍍", "🥭", "🍒", "🍑"
];

const resetEmoji = "❌"

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById("spin-button").addEventListener("click", spin) //tukaj sem nastavil listenerja ki poslusa kdaj je ghumb kliknjen

document.getElementById("reset-button").addEventListener("click", reset)

function spin() {
    let spin1 = fruits[getRandomNumber(0, fruits.length - 1)]  //tukaj se shrani mesto v seznamu
    document.getElementById("spinner1").innerHTML = spin1

    let spin2 = fruits[getRandomNumber(0, fruits.length - 1)]  //tukaj se shrani mesto v seznamu
    document.getElementById("spinner2").innerHTML = spin2

    let spin3 = fruits[getRandomNumber(0, fruits.length - 1)]  //tukaj se shrani mesto v seznamu
    document.getElementById("spinner3").innerHTML = spin3

    //  let seznamDobitkov = [spin1, spin2, spin3]

    if (spin1 === spin2 && spin2 === spin3) {                    //preverja ce so veriabli enaki
        console.log("Vse tri spremenljivke so enake.");
        document.getElementById("rezultat-box").innerHTML = "Vse tri spremenljivke so enake."
    } else if (spin1 === spin2 || spin1 === spin3 || spin2 === spin3) {
        console.log("Dve spremenljivki sta enaki.");
        document.getElementById("rezultat-box").innerHTML = "Dve spremenljivki sta enaki."
    } else {
        console.log("Nobeni dve spremenljivki nista enaki.");
        document.getElementById("rezultat-box").innerHTML = "Nobeni dve spremenljivki nista enaki."
    }




    console.log("spinner")
}

function reset() {
    document.getElementById("spinner1").innerHTML = resetEmoji

    document.getElementById("spinner2").innerHTML = resetEmoji

    document.getElementById("spinner3").innerHTML = resetEmoji
}