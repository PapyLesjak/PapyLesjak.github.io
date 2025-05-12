// Uvoz Firebase modulov
import { auth, db } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

let userDocRef; // Referenca na Firestore dokument uporabnika
let balance; // Trenutno stanje uporabnikovega računa
let isSpinning = false; // Prepreči večkratno vrtenje

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

// Posodobljena funkcija spin brez loading zaslona
function spin() {
    if (isSpinning) return; // Prepreči večkratno vrtenje

    const spinButton = document.getElementById('rolleta-button');
    const betInput = document.getElementById('betAmount');
    const colorSelect = document.getElementById('colorSelect');
    const spinner = document.getElementById('spinner');
    const resultDiv = document.getElementById('result');
    const outcomeDiv = document.getElementById('outcome');

    const betAmount = parseInt(betInput.value);
    const selectedColor = colorSelect.value;

    // Preveri veljavnost stave
    if (!betAmount || betAmount <= 0) {
        outcomeDiv.textContent = 'Enter a valid bet amount';
        return;
    }

    // Preveri, ali ima uporabnik dovolj stanja
    if (betAmount > balance) {
        outcomeDiv.textContent = 'Not enough balance';
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;

    // Odštej stavo od stanja
    balance -= betAmount;
    updateBalance();

    // Animacija vrtenja
    let colors = ['red', 'black', 'green'];
    let index = 0;
    spinner.textContent = '';
    resultDiv.textContent = 'Spinning...';
    outcomeDiv.textContent = '';

    let spinInterval = setInterval(() => {
        spinner.style.backgroundColor = colors[index];
        index = (index + 1) % colors.length;
    }, 100);

    // Ustavi vrtenje in prikaži rezultat
    setTimeout(async () => {
        clearInterval(spinInterval);
        const result = getResult();

        spinner.style.backgroundColor = result;
        spinner.textContent = result;
        resultDiv.textContent = `The roulette landed on ${result}`;

        if (result === selectedColor) {
            const multiplier = result === 'green' ? 12 : 2;
            const winnings = betAmount * multiplier;
            balance += winnings;
            outcomeDiv.textContent = `You won ${winnings}!`;
            outcomeDiv.style.color = 'green';
        } else {
            outcomeDiv.textContent = 'Better luck next time!';
            outcomeDiv.style.color = 'red';
        }

        await updateDoc(userDocRef, { balance });
        updateBalance();

        spinButton.disabled = false;
        isSpinning = false;
    }, 2000);
}

// Skrij loading zaslon ko so podatki naloženi
auth.onAuthStateChanged(async (user) => {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (user) {
        try {
            const userId = user.uid;
            userDocRef = doc(db, "users", userId);
            await fetchBalance(); // Počakaj da se naloži balance
            loadingScreen.style.display = 'none'; // Skrij loading zaslon
        } catch (error) {
            console.error("Error loading data:", error);
            alert("Error loading game data. Please try again.");
            window.location.href = "index.html";
        }
    } else {
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