const filterButtons = document.querySelectorAll(".filter-button");
const carCards = document.querySelectorAll(".car-card");

function updateInventoryFilter(selectedCategory) {
    carCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");
        const isVisible = selectedCategory === "all" || categories.includes(selectedCategory);
        card.classList.toggle("is-hidden", !isVisible);
    });
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        updateInventoryFilter(button.dataset.filter || "all");
    });
});

const priceInput = document.getElementById("price");
const downPaymentInput = document.getElementById("down-payment");
const termInput = document.getElementById("term");
const aprInput = document.getElementById("apr");
const paymentResult = document.getElementById("payment-result");

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(value);
}

function calculateMonthlyPayment() {
    const price = Number(priceInput?.value) || 0;
    const downPayment = Number(downPaymentInput?.value) || 0;
    const term = Number(termInput?.value) || 1;
    const annualRate = (Number(aprInput?.value) || 0) / 100;
    const principal = Math.max(price - downPayment, 0);
    const monthlyRate = annualRate / 12;

    if (!paymentResult) {
        return;
    }

    if (principal === 0) {
        paymentResult.textContent = "$0 / month";
        return;
    }

    if (monthlyRate === 0) {
        paymentResult.textContent = `${formatCurrency(principal / term)} / month`;
        return;
    }

    const numerator = monthlyRate * (1 + monthlyRate) ** term;
    const denominator = (1 + monthlyRate) ** term - 1;
    const monthlyPayment = principal * (numerator / denominator);

    paymentResult.textContent = `${formatCurrency(monthlyPayment)} / month`;
}

[priceInput, downPaymentInput, termInput, aprInput].forEach((field) => {
    field?.addEventListener("input", calculateMonthlyPayment);
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = event.currentTarget.querySelector("button[type='submit']");

    if (!(submitButton instanceof HTMLButtonElement)) {
        return;
    }

    submitButton.textContent = "Request received";
    submitButton.disabled = true;
});

calculateMonthlyPayment();