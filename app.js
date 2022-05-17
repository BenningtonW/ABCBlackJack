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
        playerTotalDisplay.textContent = playerTotal;
        dealerTotalDisplay.textContent = dealerTotal;
        // Has anyone got blackjack?
        if (playerTotal == 21 && dealerTotal == 21) {
            dialogueBox.textContent = "Draw!";
            gameActive = false;
        }
        else if (playerTotal == 21 || dealerTotal == 21) {
            dialogueBox.textContent = "Blackjack!";
            gameActive = false;
        }
        else {
            dialogueBox.textContent = "Your turn";
        }
    }
}

function drawCard() {
    if (gameActive == false) {
        dialogueBox.textContent = "Please start a new game"
    }
    else {
        playerTotal += drawRandomCard();
        if (playerTotal > 21) {
            dialogueBox.textContent = "Bust!";
            gameActive = false;
            gameOver = true;
        }
        playerTotalDisplay.textContent = playerTotal;
    }
}

function stand() {
    if (gameActive == false) {
        dialogueBox.textContent = "Please start a new game"
    }
    else {
        gameOver = true;
        if(dealerTotal > playerTotal) {
            dialogueBox.textContent = "You lose!"
        }
        else {
            while (dealerTotal < 17) {
                setTimeout(dealerTotal += drawRandomCard(), 2000);
                dealerTotalDisplay.textContent = dealerTotal;
            }
            if (dealerTotal > 21) {
                dialogueBox.textContent = "Dealer bust! You win!";
            }
            else if (dealerTotal > playerTotal) {
                dialogueBox.textContent = "You lose!"
            }
            else if (dealerTotal == playerTotal) {
                dialogueBox.textContent = "Draw!"
            }
            else {
                dialogueBox.textContent = "You win!"
            }
        }
        gameActive = false;
    }
}

function resetGame() {
    gameActive = false;
    gameOver = false;
    playerTotal = 0;
    dealerTotal = 0;
    playerTotalDisplay.textContent = playerTotal;
    dealerTotalDisplay.textContent = dealerTotal;
    dialogueBox.textContent = "Welcome";
    deckOfCards = [...cards, ...cards, ...cards, ...cards];
    while (gameTable.firstChild) {
        gameTable.removeChild(gameTable.firstChild);
    }
}

actionButtons.forEach(buttonElement => { buttonElement.addEventListener("click", parseInput) });
