let balance = 1000;

        function updateBalance() {
            document.getElementById('balance').textContent = balance;
        }

        function getResult() {
            const random = Math.random();
            if (random < 0.49) return 'black';
            if (random < 0.98) return 'red';
            return 'green';
        }

        function spin() {
            const betInput = document.getElementById('betAmount');
            const colorSelect = document.getElementById('colorSelect');
            const spinner = document.getElementById('spinner');
            const resultDiv = document.getElementById('result');
            const outcomeDiv = document.getElementById('outcome');

            const betAmount = parseInt(betInput.value);
            const selectedColor = colorSelect.value;

            if (!betAmount || betAmount <= 0) {
                outcomeDiv.textContent = 'Please enter a valid bet amount';
                return;
            }

            if (betAmount > balance) {
                outcomeDiv.textContent = 'You don\'t have enough balance';
                return;
            }

            // Deduct bet from balance
            balance -= betAmount;
            updateBalance();

            // Show spinning animation
            let colors = ['red', 'black', 'green'];
            let index = 0;
            spinner.textContent = '';
            resultDiv.textContent = 'Spinning...';
            outcomeDiv.textContent = '';

            let spinInterval = setInterval(() => {
                spinner.style.backgroundColor = colors[index];
                index = (index + 1) % colors.length;
            }, 100);

            setTimeout(() => {
                clearInterval(spinInterval);
                
                // Get result
                const result = getResult();
                
                // Stop animation and show result
                spinner.style.backgroundColor = result;
                spinner.textContent = result;
                resultDiv.textContent = `Landed on ${result}`;

                // Calculate winnings
                if (result === selectedColor) {
                    const multiplier = result === 'green' ? 12 : 2;
                    const winnings = betAmount * multiplier;
                    balance += winnings;
                    updateBalance();
                    outcomeDiv.textContent = `You won $${winnings}!`;
                    outcomeDiv.style.color = 'green';
                } else {
                    outcomeDiv.textContent = 'Better luck next time!';
                    outcomeDiv.style.color = 'red';
                }
            }, 2000);
        }