const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function isPalindrome(str) {
    // Basic requirement: "A palindrome is a word, phrase, or sequence of characters that reads the same backwards as forward."
    // Often this implies ignoring spaces and punctuation for phrases, but the example "racecar" is simple.
    // However, technically "A man, a plan, a canal: Panama" is a palindrome phrase.
    // I'll implement a robust version that strips non-alphanumeric chars and ignores case.

    // 1. Normalize: remove non-alphanumeric, convert to lowercase
    const cleanStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // 2. Reverse
    const reversedStr = cleanStr.split('').reverse().join('');

    // 3. Compare
    return cleanStr === reversedStr;
}

function ask() {
    rl.question('Enter a string : ', (input) => {
        if (!input) {
            rl.close();
            return;
        }

        if (isPalindrome(input)) {
            console.log(`The string ‘${input}’ is a palindrome`);
        } else {
            console.log(`The string ‘${input}’ is NOT a palindrome`);
        }

        rl.close();
    });
}

ask();
