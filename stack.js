document.addEventListener("DOMContentLoaded", async function () {
    const fetchButton = document.getElementById("fetchButton");
    const bankNameSelect = document.getElementById("bankName");
    const accountNumberInput = document.getElementById("accountNumber");
    const resultElement = document.getElementById("result");


    await fetchAndPopulateBanks();

    fetchButton.addEventListener("click", async () => {
        const selectedBankOption = bankNameSelect.options[bankNameSelect.selectedIndex];
        const bankCode = selectedBankOption.value;
        const accountNumber = accountNumberInput.value;


        try {
            const response = await fetchPaystackAPI(bankCode, accountNumber);
            const accountName = response.data.account_name;
            resultElement.textContent = "Account name "+accountName;
        } catch (error) {
            resultElement.textContent = "Failed to fetch account information.";
        }
    });
});

async function fetchAndPopulateBanks() {
    const apiKey = "sk_test_78051f0abfe0e2fa04fa70c780c62f51851014e7";
    const banksSelect = document.getElementById("bankName");
    const url = "https://api.paystack.co/bank";

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            data.data.forEach(bank => {
                const option = document.createElement("option");
                option.value = bank.code;
                option.text = bank.name;
                banksSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Failed to fetch banks:", error);
    }
}

async function fetchPaystackAPI(bankCode, accountNumber) {
    const apiKey = "sk_test_78051f0abfe0e2fa04fa70c780c62f51851014e7";
    const url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });

    if (!response.ok) {
        throw new Error("API request failed");
    }

    return response.json();
}
