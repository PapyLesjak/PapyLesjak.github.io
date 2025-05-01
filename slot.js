const fruits = [
    "🍎", "🍌", "🍊", "🍉", "🍓",
    "🍇", "🍍", "🥭", "🍒", "🍑"
];

const resetEmoji = "❌";
const spinTimes = [7, 10, 13]; // Število različnih slik pred končno izbiro
const spinCost = 10; // Cena enega vrtenja

// Funkcija za nalaganje stanja iz localStorage
function loadBalance() {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance ? parseInt(savedBalance) : 1000; // Če ni shranjenega stanja, začni z 1000
}

// Funkcija za shranjevanje stanja v localStorage
function saveBalance() {
    localStorage.setItem('balance', balance);
}

let balance = loadBalance(); // Naloži stanje ob zagonu igre

// Funkcija za posodobitev prikaza stanja na zaslonu
function updateBalance() {
    document.getElementById('balance').innerText = balance;
    saveBalance(); // Shrani stanje v localStorage
}

// Posodobi prikaz stanja ob zagonu
updateBalance();

// Funkcija za upravljanje z gumbom za spin
document.getElementById("spin-button").addEventListener("click", function () {
    if (this.disabled || balance < spinCost) {
        alert("Nimate dovolj stanja za vrtenje!");
        return; // Če ni dovolj denarja ali je gumb onemogočen
    }

    balance -= spinCost; // Odštejemo ceno vrtenja
    updateBalance(); // Posodobi prikaz stanja

    this.disabled = true; // Onemogoči gumb
    this.style.backgroundColor = "gray"; // Obarvaj v sivo

    spin();

    setTimeout(() => {
        this.disabled = false; // Omogoči gumb nazaj
        this.style.backgroundColor = ""; // Povrni prvotno barvo (CSS ga bo urejal)
    }, 1800); // Čakaj dokler se vrtenja ne končajo
});

// Funkcija za vrtenje
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
            count++;

            if (count >= spinTimes[index]) {
                clearInterval(interval);

                setTimeout(() => {
                    spinner.innerHTML = fruits[getRandomNumber(0, fruits.length - 1)];
                    finishedSpins++;

                    if (finishedSpins === spinners.length) {
                        checkWin(); // Pokliči checkWin šele, ko so vsi končali
                    }
                }, 200); // Počakaj malo po zadnjem prikazanem simbolu
            }
        }, 100); // Hitrost animacije (0.1s na sliko)
    });
}

// Funkcija za generiranje naključnega števila
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funkcija za preverjanje rezultata
function checkWin() {
    let spin1 = document.getElementById("spinner1").innerHTML;
    let spin2 = document.getElementById("spinner2").innerHTML;
    let spin3 = document.getElementById("spinner3").innerHTML;

    let winAmount = 0; // Znesek, ki ga igralec zmaga

    if (spin1 === spin2 && spin2 === spin3) {
        // Jackpot (vse enake slike)
        winAmount = spinCost * 10; // 10-kratnik vložka
        document.getElementById("rezultat-box").innerHTML = "JACKPOT!";
        iztreliKonfete();
    } else if (spin1 === spin2 || spin1 === spin3 || spin2 === spin3) {
        // Dvojček (dve enaki sliki)
        winAmount = spinCost * 2; // 2-kratnik vložka
        document.getElementById("rezultat-box").innerHTML = "DVOJČEK!";
    } else {
        // Ni zmage
        document.getElementById("rezultat-box").innerHTML = "POSKUSI ŠE ENKRAT!";
    }

    // Posodobi balance glede na zmago
    balance += winAmount;
    updateBalance(); // Posodobi prikaz stanja
}

// Funkcija za konfete (ob Jackpotu)
function iztreliKonfete() {
    confetti({
        particleCount: 150,
        spread: 200,
        origin: { y: 0.6 }
    });
}

// Funkcija za resetiranje (če bi želel dodati gumb za reset)
function reset() {
    document.getElementById("spinner1").innerHTML = resetEmoji;
    document.getElementById("spinner2").innerHTML = resetEmoji;
    document.getElementById("spinner3").innerHTML = resetEmoji;
    document.getElementById("rezultat-box").innerHTML = "";
    balance = 1000; // Resetiraj balance na začetnih 1000
    updateBalance(); // Posodobi prikaz stanja
}
