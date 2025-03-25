document.getElementById("roll-dice-button-roll").addEventListener("click", rollDice);

function rollDice() {
    const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]; // Možni simboli kocke
    let roll = Math.floor(Math.random() * 6); // Generira naključno številko od 0 do 5
    document.getElementById("dice").innerHTML = diceFaces[roll]; // Prikaže rezultat
}
