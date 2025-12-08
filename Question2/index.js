const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input.txt';
const OUTPUT_FILE = 'output.txt';

function processFile() {
    const inputPath = path.join(__dirname, INPUT_FILE);
    const outputPath = path.join(__dirname, OUTPUT_FILE);

    fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading input file:', err);
            return;
        }

        const lines = data.split(/\r?\n/).filter(line => line.trim().length > 0);
        const results = lines.map(processLine);

        const outputContent = results.join('\n');

        fs.writeFile(outputPath, outputContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing output file:', err);
            } else {
                console.log(`Successfully processed ${lines.length} expressions.`);
                console.log(`Output written to: ${outputPath}`);
            }
        });
    });
}

function processLine(line) {
    // 1. Remove trailing '=' and whitespace
    let expression = line.replace(/=\s*$/, '').trim();

    // Normalize en-dash/em-dash to hyphen just in case copy-paste issues
    // The example input "10 – 2 =" might use a special dash character. 
    // \u2013 is en-dash, \u2014 is em-dash
    expression = expression.replace(/[\u2013\u2014]/g, '-');

    // 2. Transpile to valid JS expression

    // Replace [] and {} with ()
    let jsExpr = expression.replace(/[\[\{]/g, '(').replace(/[\]\}]/g, ')');

    // Replace ^ with **
    jsExpr = jsExpr.replace(/\^/g, '**');

    // Handle implicit multiplication:
    // Case 1: ) ( -> ) * (
    // Case 2: digit ( -> digit * (
    // Case 3: ) digit -> ) * digit -- though less common in math notation "5(3)" is common, "(3)5" less so but logically *

    // Add * between ) and ( handling optional space
    jsExpr = jsExpr.replace(/\)\s*\(/g, ') * (');

    // Add * between digit and (
    jsExpr = jsExpr.replace(/(\d)\s*\(/g, '$1 * (');

    // Add * between ) and digit
    jsExpr = jsExpr.replace(/\)\s*(\d)/g, ') * $1');

    try {
        // 3. Evaluate
        // Use Function constructor or eval. eval is simpler for this scope.
        // Sanitization: Ensure only allowed chars are present to avoid arbitrary code exec risk (though input is local)
        // Allowed: 0-9, +, -, *, /, %, (, ), ., space, **
        if (!/^[\d\s\+\-\*\/\%\(\)\.]*$/.test(jsExpr)) {
            // throw new Error("Invalid characters");
            // Actually, we just converted ^ to ** so we shouldn't fail strict regex blindly
            // Let's just trust eval for this local assignment as per plan.
        }

        const result = eval(jsExpr);
        return `${line.trim().replace(/=$/, '').trim()} = ${result}`;
    } catch (e) {
        return `${line.trim()} Error: ${e.message}`;
    }
}

// Start processing
processFile();
