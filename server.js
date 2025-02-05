const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Utility functions
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};
const isPerfect = (num) => {
    if (num <= 1) return false; // Ensure 1 is not considered perfect
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num;
};



const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const power = digits.length;
    return digits.reduce((sum, digit) => sum + Math.pow(digit, power), 0) === num;
};

const getDigitSum = (num) => {
    return num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
};

app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;
    const num = parseInt(number);
    
    if (isNaN(num)) {
        return res.status(400).json({ number: "alphabet", error: true });
    }

    const properties = [];
    if (isArmstrong(num)) properties.push("armstrong");
    properties.push(num % 2 === 0 ? "even" : "odd");
    
    try {
        const funFactResponse = await axios.get(`http://numbersapi.com/${num}/math?json`);
        const funFact = funFactResponse.data.text;
        
        res.json({
            number:num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties,
            digit_sum: getDigitSum(num),
            fun_fact: funFact
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch fun fact." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
