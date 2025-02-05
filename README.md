# Number Properties API

## Overview
This API accepts a number as a query parameter and returns various mathematical properties about it, along with a fun fact fetched from the Numbers API.

## Features
- Determines if a number is **prime**, **perfect**, or **Armstrong**.
- Identifies whether the number is **odd** or **even**.
- Calculates the **sum of its digits**.
- Fetches a **fun fact** about the number.
- Returns results in **JSON format**.
- Implements **error handling** for invalid inputs.
- Supports **CORS** for cross-origin requests.

## API Endpoint

### **GET api/classify-number**
#### Query Parameters:
| Parameter | Type   | Description |
|-----------|--------|-------------|
| `number`   | number | The number to analyze |

#### Example Request:
```
GET api/classify-number?number=371
```

#### Example Successful Response:
```json
{
    "number": 371,
    "is_prime": false,
    "is_perfect": false,
    "properties": ["armstrong", "odd"],
    "digit_sum": 11,
    "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
```

#### Error Response (Invalid Input):
```json
{
    "number": "alphabet",
    "error": true
}
```

## Installation and Setup
1. Clone this repository:
   
   git clone https://github.com/mfontosco/Hng-second-task.git
   cd Hng-second-task
   
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   node server.js
   ```

## Deployment
You can deploy this API using Render

## License
This project is open-source and available under the MIT License.

## Author
Paulinus Mfon

