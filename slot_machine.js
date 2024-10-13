document.getElementById('spinButton').addEventListener('click', function() {
    const slotMachineDiv = document.querySelector('.slot-machine');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBar = document.getElementById('progressBar');
    const slotImage = document.getElementById('slotImage');

    // Show progress bar and replace slot machine with a GIF
    progressBarContainer.style.display = 'block';  // Show progress bar
    slotImage.src = 'https://raw.githubusercontent.com/Dikdikkita/assets/refs/heads/main/lets-go-gambling.gif';  // Replace static image with GIF

    // Reset progress bar width
    progressBar.style.width = '0%';

    // Simulate progress bar over 3 seconds
    let progress = 0;
    let interval = setInterval(function() {
        progress += 1;
        progressBar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            progressBarContainer.style.display = 'none';  // Hide progress bar

            // Restore the original slot machine image
            slotImage.src = 'img/slot_icon.jpg';

            // Proceed with the game logic (e.g., check if user wins)
            spinLogic();
        }
    }, 30);  // Update every 30ms to achieve 3 seconds total
});

function spinLogic() {
    const winChance = 0.5;  // Base 50% chance to win
    const houseCommission = 0.05;  // 5% commission on each bet
    const maxWinnings = 10000; // Maximum winnings limit
    let tokens = parseInt(document.getElementById('tokenCount').innerText);
    let betAmount = parseInt(document.getElementById('betAmount').value);

    // Check for valid bet
    if (isNaN(betAmount) || betAmount % 5 !== 0 || betAmount <= 0) {
        alert("Please enter a valid bet amount (multiples of 5).");
        return;
    }

    if (betAmount > tokens) {
        alert("You don't have enough tokens to bet this amount.");
        return;
    }

    // Apply house commission
    let betAfterCommission = betAmount * (1 - houseCommission);

    // Track player winning/losing streak
    let isWinningStreak = false; // You can track this using session variables

    // Dynamic payout based on winning streak
    let payoutMultiplier = 2;  // Base payout
    if (isWinningStreak) {
        payoutMultiplier *= 0.8;  // Decrease payout on winning streak
    } else {
        payoutMultiplier *= 1.2;  // Increase payout on losing streak
    }

    // Check if player wins (after applying near-miss strategy)
    let nearMiss = Math.random() < 0.15;  // 15% chance of a near-miss
    let isWin = Math.random() < winChance && !nearMiss;

    // Apply winnings or losses
    if (isWin && tokens + betAfterCommission * payoutMultiplier < maxWinnings) {
        tokens += betAfterCommission * payoutMultiplier;
        alert("You win! Your prize is " + (betAfterCommission * payoutMultiplier) + " tokens.");
    } else if (nearMiss) {
        alert("Near miss! So close.");
    } else {
        tokens -= betAmount;
        alert("Awh Dang It! You lost " + betAmount + " tokens.");
    }

    // Cap winnings
    if (tokens >= maxWinnings) {
        alert("You've reached the maximum winnings limit. New restrictions apply.");
        // Optional: introduce new restrictions (e.g., higher minimum bet)
    }

    // Update token count
    document.getElementById('tokenCount').innerText = tokens;

    // Send updated token count to server
    updateTokens(tokens);
}

function updateTokens(tokens) {
    fetch('store.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'tokens=' + tokens
    });
}

// Event listener for reset button
document.getElementById('resetButton').addEventListener('click', function() {
    // Reset token count to 500
    const defaultTokens = 500;
    document.getElementById('tokenCount').innerText = defaultTokens;

    // Send reset token value to server
    resetTokensOnServer(defaultTokens);
    
    alert("Your tokens have been reset to 500.");
});

// Function to send updated token count to the server after reset
function resetTokensOnServer(tokens) {
    fetch('store.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'tokens=' + tokens
    });
}
