// A project to replicate a slot machine game 
// Note: Install package 'prompt-sync' from npmjs to run the game

const React = require('react');
const SlotCounter = require('react-slot-counter');
const prompt = require("prompt-sync")();

const ROWS = 5;
const COLS = 5;

const SYMBOL_COUNT = {
	"@": 6,
	"#": 12,
	"&": 24,
  "$": 3
};

const SYMBOL_VALUE = {
	"@": 10,
	"#": 5, 
	"&": 1
};

// ideas: diagonal - (ie 5 lines)
// adding a multiplier of sorts so if you get maybe three @ in the whole thing, or special sequence
// using unique symbols
// orinting game rules

/**
* Prompts user to deposit money to their balance
* @returns {{numberdepositAmount: integer}} 
*/

const collectDeposit = () => {

	while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberdepositAmount = parseFloat(depositAmount);
       
   	if (isNaN(numberdepositAmount) || numberdepositAmount <= 0 ) {
      	console.log('Invalid deposit amount, please try again!');
    }
    else {
      	return numberdepositAmount;
    }
  }

}

/**
* Prompts user to enter number of lines to bet on
* @returns {numberOfLines: integer} 
*/

const getNumberLines = () => {

	while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-5): ");
    const numberOfLines = parseFloat(lines);
       
    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines >= 6) {
      	console.log('Invalid number, please try again!');
    }
    else {
      	return numberOfLines;
    }
  }

}

/**
* Prompts user to enter amount to bet per line
* @param {integer} balance 
* @param {integer} numberOfLines 
* @returns {betAmount: integer}
*/

const betPerLine = (balance, numberOfLines) => {

	while (true) {
		const bet = prompt("Enter the amount you want to be per line: ");
		const betAmount = parseFloat(bet);

		if (isNaN(betAmount) || betAmount > (balance / numberOfLines)) {
			console.log('Invalid bet amount, please try again!');
		}
		else {
			return betAmount;
		}
	}

}

/**
* Spins the slot machine and generates random sequence of symbols
* @returns {reels: array} 
*/

const spinReel = () => {

	const symbols = [];
	for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
		for (let i = 0; i < count; i++) {
			symbols.push(symbol);
		}
	}

	const reels = [];
	for (let i = 0; i < COLS; i++) {
		reels.push([]);
		const reelSymbols = [...symbols];
		for (let j = 0; j < ROWS; j++) {
			const randomIndex = Math.floor(Math.random() * reelSymbols.length);
			reels[i].push(reelSymbols[randomIndex]);
			reelSymbols.splice(randomIndex, 1);
		}
	}

	return reels;

}

/**
* Transposes the array to make them vertical columns
* @param {integer} reel
* @returns {transposedReel: array}
*/

const transposition = (reel) => {

	const transposedReel = [];
	for (let i = 0; i < ROWS; i++) {
		transposedReel.push([]);
		for (const object of reel) {
			transposedReel[i].push(object[i]);
		}
	}

	return transposedReel;

}

/**
* Prints out the slot machine 
* @param {integer} newReel 
* @returns {{}} 
*/

const printMachine = (newReel) => {

	for (const row of newReel) {
		let rowString = "";
		for (let i = 0; i < row.length; i++) {
			rowString += row[i];
			if (i !== row.length - 1) {
				rowString += " | "
			}
		}
		console.log(rowString);
	}

	return {};

}

/**
* Checks if the user has won and returns winnings
* @param {array} newReel
* @param {integer} numberOfLines 
* @param {integer} perLineAmount
* @returns {winnings: integer} 
*/

const getWinnings = (newReel, numberOfLines, perLineAmount) => {

	let winnings = 0;
	for (let i = 0; i < numberOfLines; i++) {
		const symbol = newReel[i];
		let allSame = true;
		for (const object of symbol) {
			if (object != symbol[0]) {
				allSame = false;
				break;
			}
		}
		if (allSame) {
			winnings += perLineAmount * SYMBOL_VALUE[symbol[0]];
		}
	}

	return winnings;

}

/**
* Executes and contains the main program 
* @returns {{}} 
*/

const mainGame = () => {

	let balance = collectDeposit();

	while (true) {

		console.log("You have a balance of $" + balance.toString())
		const numberOfLines = getNumberLines();
		const perLineAmount = betPerLine();
		balance -= perLineAmount * numberOfLines;

		const reel = spinReel();
		const newReel = transposition(reel);
		const printed = printMachine(newReel);
		const winnings = getWinnings(newReel, numberOfLines, perLineAmount);
		
		console.log("You won $" + winnings.toString());
		balance += winnings;

		if (balance <= 0) {
			console.log("You have insufficient funds, exiting game...");
			break;
		}

		const playAgain = prompt("Do you want to play again (y/n)?: ");
		if (playAgain !== "y") {
			break;
		}

	}

	console.log("You have exited out of the game!");
	return {};

}

mainGame();

