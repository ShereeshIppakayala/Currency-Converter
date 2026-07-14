const currencyList = {
  USD: "US",
  EUR: "DE",
  GBP: "GB",
  INR: "IN",
  JPY: "JP",
  AUD: "AU",
  CAD: "CA",
  CHF: "CH",
  CNY: "CN",
  SEK: "SE",
  NZD: "NZ",
  ZAR: "ZA",
  SGD: "SG",
  AED: "AE",
  SAR: "SA",
  HKD: "HK",
  KRW: "KR",
  BRL: "BR",
  MXN: "MX",
  PLN: "PL",
  TRY: "TR",
  THB: "TH",
  MYR: "MY",
  IDR: "ID",
  PHP: "PH",
  VND: "VN",
  NOK: "NO",
  DKK: "DK",
};

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".Ex-btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const amountInput = document.querySelector(".amount input");
const msg = document.querySelector(".msg");

const formatAmount = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = currencyList[currCode] || "US";
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
  img.alt = `${currCode} flag`;
};

const populateCurrencies = () => {
  dropdowns.forEach((select) => {
    select.innerHTML = "";

    Object.keys(currencyList).forEach((code) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = code;

      if (select.name === "from" && code === "USD") {
        option.selected = true;
      }
      if (select.name === "to" && code === "INR") {
        option.selected = true;
      }

      select.appendChild(option);
    });

    select.addEventListener("change", (event) => updateFlag(event.target));
  });

  updateFlag(fromCurr);
  updateFlag(toCurr);
};

const updateExchangeRate = async () => {
  const amountValue = Number.parseFloat(amountInput.value);
  const amount = Number.isFinite(amountValue) && amountValue > 0 ? amountValue : 1;
  amountInput.value = amount.toString();

  const from = fromCurr.value;
  const to = toCurr.value;

  msg.textContent = "Fetching latest rate...";

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    if (!response.ok) {
      throw new Error("Rate fetch failed");
    }

    const data = await response.json();
    const fromRate = data.rates?.[from];
    const toRate = data.rates?.[to];

    if (!fromRate || !toRate) {
      throw new Error("Unsupported currency pair");
    }

    const converted = (amount * toRate) / fromRate;
    msg.innerHTML = `<span>${formatAmount(amount)} ${from}</span> = <strong>${formatAmount(converted)} ${to}</strong>`;
  } catch (error) {
    console.error(error);
    msg.textContent = "Unable to load exchange rate right now.";
  }
};

btn.addEventListener("click", (event) => {
  event.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  populateCurrencies();
  updateExchangeRate();
});
