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
    document.getElementById('balance').textContent = balance;
    saveBalance(); // Shrani stanje v localStorage
}

// Funkcija za določitev rezultata vrtenja rulete
function getResult() {
    const random = Math.random(); // Generiraj naključno število med 0 in 1
    if (random < 0.49) return 'black'; // 49% možnosti za črno
    if (random < 0.98) return 'red';   // 49% možnosti za rdečo
    return 'green';                    // 2% možnosti za zeleno
}

// Funkcija za izvedbo vrtenja rulete
function spin() {
    const betInput = document.getElementById('betAmount'); // Vnos za znesek stave
    const colorSelect = document.getElementById('colorSelect'); // Izbira barve
    const spinner = document.getElementById('spinner'); // Element za prikaz vrtenja
    const resultDiv = document.getElementById('result'); // Element za prikaz rezultata
    const outcomeDiv = document.getElementById('outcome'); // Element za prikaz izida

    const betAmount = parseInt(betInput.value); // Pretvori vneseni znesek stave v celo število
    const selectedColor = colorSelect.value; // Pridobi izbrano barvo

    // Preveri, če je vnos stave veljaven
    if (!betAmount || betAmount <= 0) {
        outcomeDiv.textContent = 'Vnesite veljaven znesek stave';
        return;
    }

    // Preveri, če ima igralec dovolj stanja za stavo
    if (betAmount > balance) {
        outcomeDiv.textContent = 'Nimate dovolj stanja';
        return;
    }

    // Odštej stavo od stanja
    balance -= betAmount;
    updateBalance();

    // Prikaži animacijo vrtenja
    let colors = ['red', 'black', 'green']; // Barve na ruleti
    let index = 0;
    spinner.textContent = '';
    resultDiv.textContent = 'Vrtenje...';
    outcomeDiv.textContent = '';

    let spinInterval = setInterval(() => {
        spinner.style.backgroundColor = colors[index]; // Spreminjaj barvo med vrtenjem
        index = (index + 1) % colors.length; // Premikaj se med barvami
    }, 100);

    // Po določenem času ustavi vrtenje in prikaži rezultat
    setTimeout(() => {
        clearInterval(spinInterval);

        // Pridobi rezultat vrtenja
        const result = getResult();

        // Ustavi animacijo in prikaži rezultat
        spinner.style.backgroundColor = result;
        spinner.textContent = result;
        resultDiv.textContent = `Ruleta se je ustavila na ${result}`;

        // Izračunaj dobitke
        if (result === selectedColor) {
            const multiplier = result === 'green' ? 12 : 2; // Množitelj za zeleno ali ostale barve
            const winnings = betAmount * multiplier; // Izračunaj dobitke
            balance += winnings; // Dodaj dobitke k stanju
            updateBalance();
            outcomeDiv.textContent = `Zmagali ste ${winnings} coins!`;
            outcomeDiv.style.color = 'green'; // Prikaz zelene barve za zmago
        } else {
            outcomeDiv.textContent = 'Več sreče prihodnjič!'; // Sporočilo za izgubo
            outcomeDiv.style.color = 'red'; // Prikaz rdeče barve za izgubo
        }
    }, 2000); // Čas trajanja vrtenja
}

// Ob zagonu posodobi prikaz stanja
updateBalance();