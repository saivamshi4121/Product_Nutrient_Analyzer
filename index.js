const readline = require('readline');

function calculateNutrientDifference(nutrientData) {
    let result = [];
    
    nutrientData.forEach(nutrient => {
        let diff = nutrient.value - nutrient.threshold;
        let percentageDiff = (diff / nutrient.threshold) * 100;
        
        result.push({
            name: nutrient.name,
            difference: diff.toFixed(2),
            percentageDiff: percentageDiff.toFixed(2)
        });
    });
    
    return result;
}

function displayResults(results) {
    results.forEach(result => {
        console.log(`${result.name}: Difference = ${result.difference}, Difference in % = ${result.percentageDiff}%`);
    });
}

// Helper function to validate numerical input
function validateNumericInput(input) {
    let value = parseFloat(input);
    if (isNaN(value) || value < 0) {
        return null;
    }
    return value;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter product name: ", (product) => {
    rl.question("Is the product solid or liquid? (Enter 'solid' or 'liquid'): ", (productType) => {

        // Validate product type input
        if (productType.toLowerCase() !== "solid" && productType.toLowerCase() !== "liquid") {
            console.error("Invalid product type. Please enter either 'solid' or 'liquid'.");
            rl.close();
            return;
        }

        rl.question("Enter the serving size (in grams or ml): ", (servingSizeInput) => {
            let servingSize = validateNumericInput(servingSizeInput);
            if (!servingSize) {
                console.error("Invalid serving size. Please enter a positive number.");
                rl.close();
                return;
            }

            rl.question("Enter calories per serving: ", (caloriesInput) => {
                let calories = validateNumericInput(caloriesInput);
                if (!calories) {
                    console.error("Invalid calories value. Please enter a positive number.");
                    rl.close();
                    return;
                }

                rl.question("Enter total added sugar per serving (g): ", (sugarInput) => {
                    let sugar = validateNumericInput(sugarInput);
                    if (!sugar) {
                        console.error("Invalid sugar value. Please enter a positive number.");
                        rl.close();
                        return;
                    }

                    rl.question("Enter total added fat per serving (g): ", (fatInput) => {
                        let fat = validateNumericInput(fatInput);
                        if (!fat) {
                            console.error("Invalid fat value. Please enter a positive number.");
                            rl.close();
                            return;
                        }

                        rl.question("Enter salt per serving (mg): ", (saltInput) => {
                            let salt = validateNumericInput(saltInput);
                            if (!salt) {
                                console.error("Invalid salt value. Please enter a positive number.");
                                rl.close();
                                return;
                            }

                            // Scaling values
                            let scaledCalories = (calories / servingSize) * 100;
                            let scaledSugar = (sugar / servingSize) * 100;
                            let scaledFat = (fat / servingSize) * 100;
                            let scaledSalt = (salt / servingSize) * 100;

                            // Thresholds for solid and liquid products
                            let thresholds = {};
                            if (productType.toLowerCase() === "solid") {
                                thresholds = {
                                    calories: 250,
                                    sugar: 3, 
                                    fat: 4.2, 
                                    salt: 625 
                                };
                            } else if (productType.toLowerCase() === "liquid") {
                                thresholds = {
                                    calories: 70,
                                    sugar: 2, 
                                    fat: 1.5, 
                                    salt: 175 
                                };
                            }

                            // Create an array of threshold data
                            let thresholdData = [
                                { name: "Calories", value: scaledCalories, threshold: thresholds.calories },
                                { name: "Total Added Sugar", value: scaledSugar, threshold: thresholds.sugar },
                                { name: "Total Added Fat", value: scaledFat, threshold: thresholds.fat },
                                { name: "Salt (mg)", value: scaledSalt, threshold: thresholds.salt }
                            ];

                            // Calculate nutrient differences and display results
                            let results = calculateNutrientDifference(thresholdData);
                            displayResults(results);

                            rl.close();
                        });
                    });
                });
            });
        });
    });
});
