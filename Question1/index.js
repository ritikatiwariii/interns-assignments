const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Configuration
const WORDS_FILE = 'words.txt';
const TOP_K = 3;

// Levenshtein distance implementation
function levenshteinDistance(a, b) {
    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1  // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Function to find top K similar strings
function findSimilarStrings(input, words, k) {
    const distances = words.map(word => ({
        word: word,
        distance: levenshteinDistance(input, word)
    }));

    // Sort by distance (ascending)
    distances.sort((a, b) => a.distance - b.distance);

    // Return the top k words
    // Filter out duplicates if any (though set logic handles unique words)
    // Here we just return the top k items
    return distances.slice(0, k).map(item => item.word);
}

// Main function
function main() {
    const wordsFilePath = path.join(__dirname, WORDS_FILE);

    // 1. Read file and parse content
    fs.readFile(wordsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Split by newlines and filter empty strings
        // Also trim whitespace to ensure clean words
        const words = data.split(/\r?\n/).map(w => w.trim()).filter(w => w.length > 0);

        console.log(`Loaded ${words.length} words from ${WORDS_FILE}`);
        console.log('Type a word and press Enter to find similar words.');

        // 2. Setup interactive input
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'Input >> '
        });

        rl.prompt();

        rl.on('line', (line) => {
            const input = line.trim();
            if (input) {
                const suggestions = findSimilarStrings(input, words, TOP_K);
                console.log(`Output >> ${suggestions.join(', ')}`);
            }
            rl.prompt();
        }).on('close', () => {
            console.log('Done!');
            process.exit(0);
        });
    });
}

// Start the program
main();
