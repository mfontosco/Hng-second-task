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
    if (num <= 1) return false;
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

    // Validate input
    if (!number || isNaN(number) || number.includes(".")) {
        return res.status(400).json({ number: "alphabet", error: true });
    }

    const num = parseInt(number);
    const properties = [];

    if (isArmstrong(num)) properties.push("armstrong");
    if (num % 2 === 0) properties.push("even");
    else properties.push("odd");

    try {
        const funFactResponse = await axios.get(`http://numbersapi.com/${num}/math?json`, { timeout: 300 });
        const funFact = funFactResponse.data.text;

        res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties,
            digit_sum: getDigitSum(num),
            fun_fact: funFact
        });
    } catch (error) {
        res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties,
            digit_sum: getDigitSum(num),
            fun_fact: "No fun fact available."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
