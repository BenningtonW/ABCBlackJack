// Get all the buttons
const actionButtons = document.querySelectorAll(".action-button");
// Get the display area unordered list
const gameTable = document.getElementById("drawn-cards");
// Get the player total display
const playerTotalDisplay = document.getElementById("player-total");
// Get the dealer total display
const dealerTotalDisplay = document.getElementById("dealer-total");
// Get the dialogue box
const dialogueBox = document.getElementById("dialogue-box");

// Is a game in progress?
let gameActive = false;
// Did the game end normally?
let gameOver = false;
// Player totals
let playerTotal = 0;
let dealerTotal = 0;
// The deck
let cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
let deckOfCards = [...cards, ...cards, ...cards, ...cards];

function parseInput(buttonPressedID) {
    // Stores Element ID of the event as a string
    let buttonPressed = buttonPressedID.currentTarget.id.toString();
    // Switch based on Element ID of event
    switch (buttonPressed) {
        case ("start-button"): startGame(); break;
        case ("hit-button"): drawCard(); break;
        case ("stand-button"): stand(); break;
        case ("reset-button"): resetGame(); break;
        default: console.log("Error: Button not mapped");
    }
}

function drawRandomCard() {
    // Math.random * length returns a random number between 1 and the length of the deck
    // Math.floor makes it a whole number
    const randomCard = Math.floor(Math.random() * deckOfCards.length);
    // We splice the card out of the deck so it cannot be redrawn
    const chosenCard = deckOfCards.splice(randomCard, 1)[0];
    // Display drawn card
    const node = document.createElement("li");
    const textNode = document.createTextNode(chosenCard);
    node.appendChild(textNode);
    gameTable.appendChild(node);
    // Return the card
    return chosenCard;
}

function startGame() {
    // If last game finished and new game is pressed, reset first
    if (gameOver == true) {
        resetGame();
    }
    // Making sure start cannot be pressed if game is already going
    if (gameActive == false) {
        // Game is active
        gameActive = true;
        // Initial hand
        playerTotal += drawRandomCard();
        playerTotal += drawRandomCard();
        dealerTotal += drawRandomCard();
        dealerTotal += drawRandomCard();
        // Update the display
        playerTotalDisplay.textContent = playerTotal;
        dealerTotalDisplay.textContent = dealerTotal;
        // Has anyone instantly won?
        if (playerTotal == 21 && dealerTotal == 21) {
            dialogueBox.textContent = "Draw!";
            gameActive = false;
            gameOver = true;
        }
        else if (playerTotal == 21 || dealerTotal == 21) {
            dialogueBox.textContent = "Blackjack!";
            gameActive = false;
            gameOver = true;
        }
        else {
            dialogueBox.textContent = "Your turn";
        }
    }
}

function drawCard() {
    // Disable button if game is not active
    if (gameActive == false) {
        dialogueBox.textContent = "Please start a new game"
    }
    else {
        // Draw card
        playerTotal += drawRandomCard();
        // Check if player bust
        if (playerTotal > 21) {
            dialogueBox.textContent = "Bust!";
            gameActive = false;
            gameOver = true;
        }
        // Update display
        playerTotalDisplay.textContent = playerTotal;
    }
}

function stand() {
    // Disable button if game is not active
    if (gameActive == false) {
        dialogueBox.textContent = "Please start a new game"
    }
    else {
        // gameOver means the game will reset if a new one is started
        gameOver = true;
        // If the dealer has beaten the player instantly
        if (dealerTotal > playerTotal) {
            dialogueBox.textContent = "You lose!"
        }
        else {
            // Dealer must hit if he has less than 17
            while (dealerTotal < 17) {
                // Delay drawing of multiple cards for dramatic effect
                setTimeout(dealerTotal += drawRandomCard(), 2000);
                // Update display
                dealerTotalDisplay.textContent = dealerTotal;
            }
            // Did the dealer bust?
            if (dealerTotal > 21) {
                dialogueBox.textContent = "Dealer bust! You win!";
            }
            // Did the dealer beat the player?
            else if (dealerTotal > playerTotal) {
                dialogueBox.textContent = "You lose!"
            }
            // Did the dealer tie with the player?
            else if (dealerTotal == playerTotal) {
                dialogueBox.textContent = "Draw!"
            }
            // This will only be reached if the player has a better hand than the dealer
            else {
                dialogueBox.textContent = "You win!"
            }
        }
        gameActive = false;
    }
}

function resetGame() {
    // Resets all our variables
    gameActive = false;
    gameOver = false;
    playerTotal = 0;
    dealerTotal = 0;
    // Resets the displays
    playerTotalDisplay.textContent = playerTotal;
    dealerTotalDisplay.textContent = dealerTotal;
    dialogueBox.textContent = "Welcome";
    // Repopulate the deck as we took out cards
    deckOfCards = [...cards, ...cards, ...cards, ...cards];
    // Clear the log of drawn cards
    while (gameTable.firstChild) {
        gameTable.removeChild(gameTable.firstChild);
    }
}

// Adds an event listener to each of the buttons
actionButtons.forEach(buttonElement => { buttonElement.addEventListener("click", parseInput) });
