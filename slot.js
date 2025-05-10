// Import Firebase modules
import { auth, db } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Slot machine symbols
const fruits = [
    "🍎", "🍌", "🍊", "🍉", "🍓", // Symbols for the slot machine
    "🍇", "🍍", "🥭", "🍒", "🍑"
];

const resetEmoji = "❌"; // Reset symbol
const spinTimes = [7, 10, 13]; // Number of spins for each reel
const spinCost = 10; // Cost of a spin

let userDocRef; // Reference to the user's Firestore document
let balance = 0; // User's balance

// Fetch the user's balance from Firestore
async function fetchBalance() {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        balance = userDoc.data().balance; // Set balance from Firestore
        updateBalance(); // Update balance display
    } else {
        console.error("User document does not exist!");
    }
}

// Save the user's balance to Firestore
async function saveBalance() {
    if (userDocRef) {
        await updateDoc(userDocRef, { balance });
    }
}

// Update balance display on the screen
function updateBalance() {
    document.getElementById('balance').innerText = balance;
}

// Handle spin button click
document.getElementById("spin-button").addEventListener("click", async function () {
    const resultBox = document.getElementById("rezultat-box");
    resultBox.textContent = "Spinning..."; // Show spinning message

    if (this.disabled || balance < spinCost) {
        resultBox.textContent = "Not enough balance!";
        return;
    }

    balance -= spinCost; // Deduct spin cost
    updateBalance(); // Update balance display
    await saveBalance(); // Save updated balance to Firestore

    this.disabled = true; // Disable the button during the spin
    this.style.backgroundColor = "gray"; // Change button color to gray

    spin(async () => {
        this.disabled = false; // Re-enable the button after the spin
        this.style.backgroundColor = ""; // Reset button color
        await saveBalance(); // Save updated balance after the spin
    });
});

// Spin function
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
                        checkWin(); // Check the result after all reels stop
                        callback(); // Re-enable the spin button
                    }
                }, 200);
            }
        }, 100);
    });
}

// Generate a random number
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check the result of the spin
function checkWin() {
    let spin1 = document.getElementById("spinner1").innerHTML;
    let spin2 = document.getElementById("spinner2").innerHTML;
    let spin3 = document.getElementById("spinner3").innerHTML;

    let winAmount = 0;
    const resultBox = document.getElementById("rezultat-box");

    if (spin1 === spin2 && spin2 === spin3) {
        // Jackpot (all symbols match)
        winAmount = spinCost * 10;
        resultBox.textContent = "JACKPOT!";
        iztreliKonfete(); // Show confetti for jackpot
    } else if (spin1 === spin2 || spin1 === spin3 || spin2 === spin3) {
        // Pair (two symbols match)
        winAmount = spinCost * 2;
        resultBox.textContent = "You got a pair!";
    } else {
        // No win
        resultBox.textContent = "Better luck next time!";
    }

    // Update balance based on winnings
    balance += winAmount;
    updateBalance(); // Update balance display
}

// Show confetti for jackpot
function iztreliKonfete() {
    confetti({
        particleCount: 150,
        spread: 200,
        origin: { y: 0.6 }
    });
}

// Firebase authentication and Firestore integration
auth.onAuthStateChanged(async (user) => {
    const spinButton = document.getElementById("spin-button");

    if (user) {
        const userId = user.uid;
        userDocRef = doc(db, "users", userId);

        // Fetch the user's balance from Firestore
        await fetchBalance();

        // Enable the spin button
        if (spinButton) {
            spinButton.disabled = false;
        }
    } else {
        // Redirect to login page if the user is not logged in
        alert("You need to log in to play!");
        window.location.href = "login.html";

        // Disable the spin button
        if (spinButton) {
            spinButton.disabled = true;
        }
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
