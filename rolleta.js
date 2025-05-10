// Uvoz Firebase modulov
import { auth, db } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

let userDocRef; // Referenca na Firestore dokument uporabnika
let balance; // Trenutno stanje uporabnikovega računa

// Posodobi prikaz stanja na zaslonu
function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = balance !== undefined ? balance : "Not logged in"; // Prikaz stanja ali obvestilo
    }
}

// Pridobi stanje uporabnika iz Firestore
async function fetchBalance() {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        balance = userDoc.data().balance; // Nastavi stanje iz Firestore
    } else {
        // Inicializiraj stanje uporabnika v Firestore
        balance = 1000; // Privzeto stanje
        await setDoc(userDocRef, { balance });
    }
    updateBalance(); // Posodobi prikaz stanja
}

// Pridobi naključni rezultat rulete
function getResult() {
    const random = Math.random(); // Ustvari naključno število med 0 in 1
    if (random < 0.49) return 'black'; // 49% možnost za črno
    if (random < 0.98) return 'red';   // 49% možnost za rdečo
    return 'green';                    // 2% možnost za zeleno
}

// Obdelava vrtenja rulete
async function spin() {
    const spinButton = document.getElementById('rolleta-button'); // Gumb za vrtenje
    const betInput = document.getElementById('betAmount'); // Polje za vnos stave
    const colorSelect = document.getElementById('colorSelect'); // Izbira barve
    const spinner = document.getElementById('spinner'); // Element za prikaz vrtenja
    const resultDiv = document.getElementById('result'); // Prikaz rezultata
    const outcomeDiv = document.getElementById('outcome'); // Prikaz izida

    const betAmount = parseInt(betInput.value); // Pretvori vneseno stavo v celo število
    const selectedColor = colorSelect.value; // Pridobi izbrano barvo

    // Preveri veljavnost stave
    if (!betAmount || betAmount <= 0) {
        outcomeDiv.textContent = 'Enter a valid bet amount'; // Obvestilo o neveljavni stavi
        return;
    }

    // Preveri, ali ima uporabnik dovolj stanja
    if (betAmount > balance) {
        outcomeDiv.textContent = 'Not enough balance'; // Obvestilo o pomanjkanju sredstev
        return;
    }

    // Onemogoči gumb za vrtenje, da prepreči večkratne klike
    spinButton.disabled = true;

    // Odštej stavo od stanja
    balance -= betAmount;
    updateBalance();

    // Prikaži animacijo vrtenja
    let colors = ['red', 'black', 'green']; // Barve rulete
    let index = 0;
    spinner.textContent = '';
    resultDiv.textContent = 'Spinning...';
    outcomeDiv.textContent = '';

    let spinInterval = setInterval(() => {
        spinner.style.backgroundColor = colors[index]; // Spremeni barvo vrtenja
        index = (index + 1) % colors.length; // Ciklično prehajaj med barvami
    }, 100);

    // Ustavi vrtenje in prikaži rezultat po zakasnitvi
    setTimeout(async () => {
        clearInterval(spinInterval);

        // Pridobi rezultat vrtenja
        const result = getResult();

        // Ustavi animacijo in prikaži rezultat
        spinner.style.backgroundColor = result;
        spinner.textContent = result;
        resultDiv.textContent = `The roulette landed on ${result}`;

        // Izračunaj dobitke
        if (result === selectedColor) {
            const multiplier = result === 'green' ? 12 : 2; // Množitelj za zeleno ali druge barve
            const winnings = betAmount * multiplier; // Izračunaj dobitke
            balance += winnings; // Dodaj dobitke k stanju
            outcomeDiv.textContent = `You won ${winnings}!`;
            outcomeDiv.style.color = 'green'; // Prikaz zelene barve za zmago
        } else {
            outcomeDiv.textContent = 'Better luck next time!';
            outcomeDiv.style.color = 'red'; // Prikaz rdeče barve za poraz
        }

        // Posodobi stanje v Firestore
        await updateDoc(userDocRef, { balance });
        updateBalance();

        // Ponovno omogoči gumb za vrtenje po zaključku
        spinButton.disabled = false;
    }, 2000); // Trajanje vrtenja
}

// Firebase avtentikacija in integracija s Firestore
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userId = user.uid;
        userDocRef = doc(db, "users", userId);

        // Pridobi stanje uporabnika iz Firestore
        await fetchBalance();
    } else {
        // Preusmeri na stran za prijavo, če uporabnik ni prijavljen
        alert("You need to log in to play!");
        window.location.href = "login.html";
    }
});

// Add event listener for the LOGOUT button
document.getElementById("header-logout-button").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("You have been logged out."); // Notify the user
            window.location.href = "login.html"; // Redirect to the login page
        })
        .catch((error) => {
            console.error("Error logging out:", error); // Log any errors
        });
});

// Poveži funkcijo spin z globalnim objektom window
window.spin = spin;