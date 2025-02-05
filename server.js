const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const cache = new Map();
const CACHE_TTL = 60 * 1000; 

const getCachedFunFact = (num) => {
    const cached = cache.get(num);
    return cached && Date.now() - cached.timestamp < CACHE_TTL ? cached.fact : null;
};

const isPrime = (num) => {
    if (num < 2) return false;
    if (num % 2 === 0 && num !== 2) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
};

const isPerfect = (num) => {
    if (num <= 1) return false;
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            sum += i + (i !== num / i ? num / i : 0);
        }
    }
    return sum === num;
};

const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const power = digits.length;
    return digits.reduce((sum, digit) => sum + Math.pow(digit, power), 0) === num;
};

const getDigitSum = (num) => num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);

const axiosInstance = axios.create({ timeout: 300 });

app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;

    if (!number || isNaN(number) || number.includes(".")) {
        return res.status(400).json({ number: "alphabet", error: true });
    }

    const num = parseInt(number);
    const properties = [];

    if (isArmstrong(num)) properties.push("armstrong");
    properties.push(num % 2 === 0 ? "even" : "odd");

    let funFact = getCachedFunFact(num);

    if (!funFact) {
        try {
            const funFactResponse = await axiosInstance.get(`http://numbersapi.com/${num}/math?json`);
            funFact = funFactResponse.data.text;
            cache.set(num, { fact: funFact, timestamp: Date.now() });
        } catch (error) {
            funFact = "No fun fact available.";
        }
    }

    res.json({
        number: num,
        is_prime: isPrime(num),
        is_perfect: isPerfect(num),
        properties,
        digit_sum: getDigitSum(num),
        fun_fact: funFact
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
