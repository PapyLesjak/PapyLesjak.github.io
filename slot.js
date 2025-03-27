const fruits = [
    "🍎", "🍌", "🍊", "🍉", "🍓",
    "🍇", "🍍", "🥭", "🍒", "🍑"
];

const resetEmoji = "❌";
const spinTimes = [3, 5, 7];  // Število različnih slik pred končno izbiro

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById("spin-button").addEventListener("click", function() {
    if (this.disabled) return;

    this.disabled = true;  // Onemogoči gumb
    this.style.backgroundColor = "gray"; // Obarvaj v sivo

    spin();

    setTimeout(() => {
        this.disabled = false;  // Omogoči gumb nazaj
        this.style.backgroundColor = ""; // Povrni prvotno barvo (CSS ga bo urejal)
    }, 2300); // 5s, ker zadnji kolut potrebuje največ časa
});



function spin() {
    const spinners = [
        document.getElementById("spinner1"),
        document.getElementById("spinner2"),
        document.getElementById("spinner3")
    ];

    document.getElementById("rezultat-box").innerHTML = "Vrtenje...";

    let finishedSpins = 0; // Števec zaključenih vrtiljakov

    spinners.forEach((spinner, index) => {
        let count = 0;
        let interval = setInterval(() => {
            spinner.innerHTML = fruits[getRandomNumber(0, fruits.length - 1)];
            count++;  // Tukaj mora biti count++, ne na začetku
            
            if (count >= spinTimes[index]) {
                clearInterval(interval);
                
                setTimeout(() => {
                    spinner.innerHTML = fruits[getRandomNumber(0, fruits.length - 1)];
                    finishedSpins++;  // Povečamo števec zaključenih vrtenj

                    if (finishedSpins === spinners.length) {
                        checkWin(); // Pokliči checkWin ŠELE, KO SO VSI KONČALI
                    }
                }, 200); // Počakaj malo po zadnjem prikazanem simbolu
            }
        }, 300); // Hitrost animacije (0.4s na sliko)
    });
}

function checkWin() {
    let spin1 = document.getElementById("spinner1").innerHTML;
    let spin2 = document.getElementById("spinner2").innerHTML;
    let spin3 = document.getElementById("spinner3").innerHTML;

    if (spin1 === spin2 && spin2 === spin3) {
        console.log("JACKPOT");
        document.getElementById("rezultat-box").innerHTML = "JACKPOT!";
        iztreliKonfete();
    } else if (spin1 === spin2 || spin1 === spin3 || spin2 === spin3) {
        console.log("DVOJČEK");
        document.getElementById("rezultat-box").innerHTML = "DVOJČEK";
    } else {
        console.log("POSKUSI ŠE ENKRAT");
        document.getElementById("rezultat-box").innerHTML = "POSKUSI ŠE ENKRAT";
    }
}

// Funkcija za konfete
function iztreliKonfete() {
    confetti({
        particleCount: 150,
        spread: 200,
        origin: { y: 0.6 }
    });
}

// Funkcija za reset
function reset() {
    document.getElementById("spinner1").innerHTML = resetEmoji;
    document.getElementById("spinner2").innerHTML = resetEmoji;
    document.getElementById("spinner3").innerHTML = resetEmoji;
    document.getElementById("rezultat-box").innerHTML = "";
}
