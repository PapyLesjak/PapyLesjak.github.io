// Uvoz Firebase modulov
import { auth, db } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Simboli za igralni avtomat
const fruits = [
    "🍎", "🍌", "🍊", "🍉", "🍓", // Simboli za igralni avtomat
    "🍇", "🍍", "🥭", "🍒", "🍑"
];

const resetEmoji = "❌"; // Simbol za ponastavitev
const spinTimes = [7, 10, 13]; // Število vrtenj za vsak kolut
const spinCost = 10; // Cena enega vrtenja

let userDocRef; // Referenca na Firestore dokument uporabnika
let balance = 0; // Trenutno stanje uporabnikovega računa

// Pridobi stanje uporabnika iz Firestore
async function fetchBalance() {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        balance = userDoc.data().balance; // Nastavi stanje iz Firestore
        updateBalance(); // Posodobi prikaz stanja
    } else {
        console.error("Dokument uporabnika ne obstaja!");
    }
}

// Shrani stanje uporabnika v Firestore
async function saveBalance() {
    if (userDocRef) {
        await updateDoc(userDocRef, { balance });
    }
}

// Posodobi prikaz stanja na zaslonu
function updateBalance() {
    document.getElementById('balance').innerText = balance;
}

// Obdelava klika na gumb za vrtenje
document.getElementById("spin-button").addEventListener("click", async function () {
    const resultBox = document.getElementById("rezultat-box");
    resultBox.textContent = "Vrtenje..."; // Prikaz sporočila o vrtenju

    if (this.disabled || balance < spinCost) {
        resultBox.textContent = "Premalo stanja!";
        return;
    }

    balance -= spinCost; // Odštej ceno vrtenja
    updateBalance(); // Posodobi prikaz stanja
    await saveBalance(); // Shrani posodobljeno stanje v Firestore

    this.disabled = true; // Onemogoči gumb med vrtenjem
    this.style.backgroundColor = "gray"; // Spremeni barvo gumba v sivo

    spin(async () => {
        this.disabled = false; // Ponovno omogoči gumb po vrtenju
        this.style.backgroundColor = ""; // Ponastavi barvo gumba
        await saveBalance(); // Shrani posodobljeno stanje po vrtenju
    });
});

// Funkcija za vrtenje kolutov
function spin(callback) {
    const spinners = [
        document.getElementById("spinner1"),
        document.getElementById("spinner2"),
        document.getElementById("spinner3")
    ];

    let finishedSpins = 0;

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
                        checkWin(); // Preveri rezultat po zaključku vrtenja
                        callback(); // Ponovno omogoči gumb za vrtenje
                    }
                }, 200);
            }
        }, 100);
    });
}

// Generiraj naključno število
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Preveri rezultat vrtenja
function checkWin() {
    let spin1 = document.getElementById("spinner1").innerHTML;
    let spin2 = document.getElementById("spinner2").innerHTML;
    let spin3 = document.getElementById("spinner3").innerHTML;

    let winAmount = 0;
    const resultBox = document.getElementById("rezultat-box");

    if (spin1 === spin2 && spin2 === spin3) {
        // Jackpot (vsi simboli se ujemajo)
        winAmount = spinCost * 10;
        resultBox.textContent = "JACKPOT!";
        iztreliKonfete(); // Prikaži konfete za jackpot
    } else if (spin1 === spin2 || spin1 === spin3 || spin2 === spin3) {
        // Par (dva simbola se ujemata)
        winAmount = spinCost * 2;
        resultBox.textContent = "Imate par!";
    } else {
        // Brez zmage
        resultBox.textContent = "Več sreče prihodnjič!";
    }

    // Posodobi stanje glede na dobitke
    balance += winAmount;
    updateBalance(); // Posodobi prikaz stanja
}

// Prikaži konfete za jackpot
function iztreliKonfete() {
    confetti({
        particleCount: 150,
        spread: 200,
        origin: { y: 0.6 }
    });
}

// Firebase avtentikacija in integracija s Firestore
auth.onAuthStateChanged(async (user) => {
    const spinButton = document.getElementById("spin-button");

    if (user) {
        const userId = user.uid;
        userDocRef = doc(db, "users", userId);

        // Pridobi stanje uporabnika iz Firestore
        await fetchBalance();

        // Omogoči gumb za vrtenje
        if (spinButton) {
            spinButton.disabled = false;
        }
    } else {
        // Preusmeri na stran za prijavo, če uporabnik ni prijavljen
        alert("Za igranje se morate prijaviti!");
        window.location.href = "login.html";

        // Onemogoči gumb za vrtenje
        if (spinButton) {
            spinButton.disabled = true;
        }
    }
});

// Dodaj poslušalca dogodkov za gumb za odjavo
document.getElementById("header-logout-button").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("Uspešno ste se odjavili."); // Obvestilo o odjavi
            window.location.href = "login.html"; // Preusmeri na stran za prijavo
        })
        .catch((error) => {
            console.error("Napaka pri odjavi:", error); // Prikaz napake pri odjavi
        });
});
