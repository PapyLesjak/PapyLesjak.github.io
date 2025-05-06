import { auth, db } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

let userDocRef; // Reference to the user's Firestore document
let balance; // User's balance (undefined if not logged in)

// Update balance display on the screen
function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = balance !== undefined ? balance : "Not logged in";
    }
}

// Fetch user balance from Firestore
async function fetchBalance() {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        balance = userDoc.data().balance;
    } else {
        // Initialize user balance in Firestore
        balance = 1000; // Default balance
        await setDoc(userDocRef, { balance });
    }
    updateBalance();
}

// Get random roulette result
function getResult() {
    const random = Math.random(); // Generate random number between 0 and 1
    if (random < 0.49) return 'black'; // 49% chance for black
    if (random < 0.98) return 'red';   // 49% chance for red
    return 'green';                    // 2% chance for green
}

// Handle roulette spin
async function spin() {
    const spinButton = document.getElementById('rolleta-button'); // Spin button
    const betInput = document.getElementById('betAmount'); // Input for bet amount
    const colorSelect = document.getElementById('colorSelect'); // Color selection
    const spinner = document.getElementById('spinner'); // Spinner element
    const resultDiv = document.getElementById('result'); // Result display
    const outcomeDiv = document.getElementById('outcome'); // Outcome display

    const betAmount = parseInt(betInput.value); // Convert bet amount to integer
    const selectedColor = colorSelect.value; // Get selected color

    // Validate bet amount
    if (!betAmount || betAmount <= 0) {
        outcomeDiv.textContent = 'Enter a valid bet amount';
        return;
    }

    // Check if the user has enough balance
    if (betAmount > balance) {
        outcomeDiv.textContent = 'Not enough balance';
        return;
    }

    // Disable the spin button to prevent multiple clicks
    spinButton.disabled = true;

    // Deduct bet amount from balance
    balance -= betAmount;
    updateBalance();

    // Show spinning animation
    let colors = ['red', 'black', 'green']; // Roulette colors
    let index = 0;
    spinner.textContent = '';
    resultDiv.textContent = 'Spinning...';
    outcomeDiv.textContent = '';

    let spinInterval = setInterval(() => {
        spinner.style.backgroundColor = colors[index]; // Change spinner color
        index = (index + 1) % colors.length; // Cycle through colors
    }, 100);

    // Stop spinning and show result after a delay
    setTimeout(async () => {
        clearInterval(spinInterval);

        // Get spin result
        const result = getResult();

        // Stop animation and show result
        spinner.style.backgroundColor = result;
        spinner.textContent = result;
        resultDiv.textContent = `The roulette landed on ${result}`;

        // Calculate winnings
        if (result === selectedColor) {
            const multiplier = result === 'green' ? 12 : 2; // Multiplier for green or other colors
            const winnings = betAmount * multiplier; // Calculate winnings
            balance += winnings; // Add winnings to balance
            outcomeDiv.textContent = `You won ${winnings}!`;
            outcomeDiv.style.color = 'green'; // Show green color for win
        } else {
            outcomeDiv.textContent = 'Better luck next time!';
            outcomeDiv.style.color = 'red'; // Show red color for loss
        }

        // Update balance in Firestore
        await updateDoc(userDocRef, { balance });
        updateBalance();

        // Re-enable the spin button after the spin is complete
        spinButton.disabled = false;
    }, 2000); // Spin duration
}

// Firebase Authentication and Firestore Integration
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userId = user.uid;
        userDocRef = doc(db, "users", userId);

        // Fetch user balance from Firestore
        await fetchBalance();
    } else {
        // Redirect to login page if the user is not logged in
        alert("You need to log in to play!");
        window.location.href = "login.html";
    }
});

// Attach the spin function to the global window object
window.spin = spin;