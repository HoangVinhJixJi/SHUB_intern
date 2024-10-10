const axios = require('axios');


const INPUT_URL = "https://test-share.shub.edu.vn/api/intern-test/input";
const OUTPUT_URL = "https://test-share.shub.edu.vn/api/intern-test/output";

// Hàm lấy dữ liệu từ API
async function fetchData() {
    const response = await axios.get(INPUT_URL);
    return response.data;
}

// Hàm gửi kết quả đến API
async function sendResults(token, results) {
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const outputData = results;
    const response = await axios.post(OUTPUT_URL, outputData, { headers });

    return response;
}

// Hàm tính toán tổng dồn (toàn bộ mảng, vị trí chẵn, vị trí lẻ)
function calculatePrefixSums(data) {
    const n = data.length;
    const prefixSum = new Array(n + 1).fill(0);
    const prefixEven = new Array(n + 1).fill(0);
    const prefixOdd = new Array(n + 1).fill(0);

    for (let i = 1; i <= n; i++) {
        prefixSum[i] = prefixSum[i - 1] + data[i - 1];
        if ((i - 1) % 2 === 0) { //(i-1) là vị trí index trong mảng data
            //Vị trí chẵn
            prefixEven[i] = prefixEven[i - 1] + data[i - 1];
            prefixOdd[i] = prefixOdd[i - 1];
        } else {
            //Vị trí lẻ
            prefixOdd[i] = prefixOdd[i - 1] + data[i - 1];
            prefixEven[i] = prefixEven[i - 1];
        }
    }


    return { prefixSum, prefixEven, prefixOdd };
}

// Hàm xử lý truy vấn
function processQueries(data, queries) {
    const { prefixSum, prefixEven, prefixOdd } = calculatePrefixSums(data);
    const results = [];

    queries.forEach(query => {
        const [l, r] = query.range;

        if (query.type === "1") {
            //Tính tổng trong khoảng [l, r]
            const result = prefixSum[r + 1] - prefixSum[l];
            results.push(result);
        } else if (query.type === "2") {

            // Tính tổng vị trí chẵn trừ tổng vị trí lẻ
            const totalEven = prefixEven[r + 1] - prefixEven[l];
            const totalOdd = prefixOdd[r + 1] - prefixOdd[l];
            const result = totalEven - totalOdd;

            results.push(result);
        }
    });
    console.log("results: ", results);

    return results;
}


async function main() {
    try {
        // Bước 1: Lấy dữ liệu từ API
        const inputData = await fetchData();
        console.log("inputData: ", inputData);

        const { token, data, query } = inputData;

        const results = processQueries(data, query);
        const response = await sendResults(token, results);
        console.log(response.status, " : ", response.data);
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
    }
}

main();
