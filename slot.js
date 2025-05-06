import { auth, db } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const fruits = [
    "🍎", "🍌", "🍊", "🍉", "🍓", // Symbols for the slot machine
    "🍇", "🍍", "🥭", "🍒", "🍑"
];

const spinTimes = [7, 10, 13]; // Number of spins for each reel
const spinCost = 10; // Cost of a spin

let userDocRef; // Reference to the user's Firestore document
let balance; // User's balance (undefined if not logged in)

// Update balance display on the screen
function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.innerText = balance !== undefined ? balance : "Not logged in";
    }
}

// Handle spin button click
function handleSpin() {
    const resultBox = document.getElementById("rezultat-box");
    resultBox.textContent = "Spinning..."; // Show spinning message

    if (balance === undefined) {
        resultBox.textContent = "You need to log in to play!";
        return;
    }

    if (balance < spinCost) {
        resultBox.textContent = "Not enough balance!";
        return;
    }

    balance -= spinCost; // Deduct spin cost
    updateBalance(); // Update balance display

    spin(async () => {
        const winnings = Math.random() > 0.5 ? spinCost * 2 : 0; // 50% chance to win
        balance += winnings;

        // Update balance in Firestore
        await updateDoc(userDocRef, { balance });

        // Update balance on the page
        updateBalance();

        // Display result in the result box
        if (winnings > 0) {
            resultBox.textContent = `You won $${winnings}!`;
        } else {
            resultBox.textContent = "Better luck next time!";
        }
    });
}

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

// Firebase Authentication and Firestore Integration
auth.onAuthStateChanged(async (user) => {
    const spinButton = document.getElementById("spin-button");

    if (user) {
        const userId = user.uid;
        userDocRef = doc(db, "users", userId);

        // Fetch user balance from Firestore
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            balance = userDoc.data().balance;
        } else {
            // Initialize user balance in Firestore
            balance = 1000; // Default balance
            await setDoc(userDocRef, { balance });
        }

        // Display balance on the page
        updateBalance();

        // Enable the spin button
        if (spinButton) {
            spinButton.disabled = false;
            spinButton.addEventListener("click", handleSpin);
        }
    } else {
        // Redirect to login page if the user is not logged in
        alert("You need to log in to play!");
        window.location.href = "login.html";

        // Disable the spin button
        if (spinButton) {
            spinButton.disabled = true;
        }

        // Set balance to undefined
        balance = undefined;
        updateBalance();
    }
});

// Add event listener for the Logout button
document.getElementById("header-logout-button").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("You have been logged out.");
            window.location.href = "login.html"; // Redirect to login page
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
});
