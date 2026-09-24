// Sample transaction data
const txs = [
  {
    id: 1,
    name: "Salary deposit",
    meta: "Today · Primary account",
    amount: 72450,
    type: "income",
    icon: "↗"
  },
  {
    id: 2,
    name: "Zemen Coffee",
    meta: "Today · Card payment",
    amount: -680,
    type: "expense",
    icon: "☕"
  },
  {
    id: 3,
    name: "Ride • Feres",
    meta: "Yesterday · Transport",
    amount: -420,
    type: "expense",
    icon: "↗"
  },
  {
    id: 4,
    name: "Melat Girma",
    meta: "Sep 18 · Transfer",
    amount: -2500,
    type: "expense",
    icon: "→"
  },
  {
    id: 5,
    name: "Freelance project",
    meta: "Sep 16 · Incoming transfer",
    amount: 12500,
    type: "income",
    icon: "◇"
  },
  {
    id: 6,
    name: "Streaming subscription",
    meta: "Sep 15 · Card payment",
    amount: -899,
    type: "expense",
    icon: "▶"
  }
];

// Page navigation
const pages = [
  "overview",
  "accounts",
  "transfers",
  "transactions",
  "cards",
  "settings"
];

const titleMap = {
  overview: "Good evening, Nathnael.",
  accounts: "Your accounts",
  transfers: "Send money securely",
  transactions: "Your transactions",
  cards: "Your cards",
  settings: "Account preferences"
};

// Small DOM helpers
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Switch between dashboard sections
function showPage(page) {
  if (!pages.includes(page)) return;

  $$(".page").forEach((item) => item.classList.remove("active"));
  $(`#page-${page}`).classList.add("active");

  $$(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  $$(".bottom-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  $("#pageTitle").textContent = titleMap[page];
  window.scrollTo({ top: 0, behavior: "smooth" });
  $("#sidebar").classList.remove("open");
}

$$("[data-page]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

// Render the dashboard activity list
function renderRecent() {
  $("#recentTransactions").innerHTML = txs
    .slice(0, 5)
    .map(
      (transaction) => `
        <div class="transaction">
          <div class="tx-icon">${transaction.icon}</div>
          <div class="tx-main">
            <b>${transaction.name}</b>
            <small>${transaction.meta}</small>
          </div>
          <div class="tx-amount ${transaction.type === "income" ? "in" : "out"}">
            ${transaction.amount > 0 ? "+" : "−"} ETB ${Math.abs(transaction.amount).toLocaleString()}
          </div>
        </div>
      `
    )
    .join("");
}

// Render the full transaction table
function renderTable() {
  const query = $("#transactionSearch")?.value.toLowerCase() || "";
  const filter = $("#transactionFilter")?.value || "all";

  const list = txs.filter((transaction) => {
    const matchesFilter = filter === "all" || transaction.type === filter;
    const details = `${transaction.name} ${transaction.meta}`.toLowerCase();
    return matchesFilter && details.includes(query);
  });

  $("#transactionTable").innerHTML = `
    <table class="tx-table">
      <thead>
        <tr>
          <th>Transaction</th>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${list
          .map(
            (transaction) => `
              <tr>
                <td><b>${transaction.name}</b></td>
                <td>${transaction.meta.split(" · ")[0]}</td>
                <td>${transaction.type === "income" ? "Money in" : "Money out"}</td>
                <td class="${transaction.type === "income" ? "up" : ""}">
                  <b>${transaction.amount > 0 ? "+" : "−"} ETB ${Math.abs(transaction.amount).toLocaleString()}</b>
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

// Initial render
renderRecent();
renderTable();

$("#transactionSearch").addEventListener("input", renderTable);
$("#transactionFilter").addEventListener("change", renderTable);

$("#menuBtn").addEventListener("click", () => {
  $("#sidebar").classList.toggle("open");
});

$("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  $("#themeBtn").textContent = document.body.classList.contains("dark") ? "☾" : "☼";
});

let hidden = false;

$("#toggleBalance").addEventListener("click", () => {
  hidden = !hidden;
  $("#balanceValue").textContent = hidden ? "ETB ••••••••" : "ETB 284,650.75";
  $("#toggleBalance").textContent = hidden ? "○" : "◉";
});

// Simple toast notification
function toast(title, text = "Action completed successfully.") {
  $("#toastTitle").textContent = title;
  $("#toastText").textContent = text;
  $("#toast").classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    $("#toast").classList.remove("show");
  }, 2800);
}

// Reusable modal helper
function modal(html) {
  $("#modalContent").innerHTML = html;
  $("#modalBackdrop").classList.add("show");
}

$("#modalClose").addEventListener("click", () => {
  $("#modalBackdrop").classList.remove("show");
});

$("#modalBackdrop").addEventListener("click", (event) => {
  if (event.target.id === "modalBackdrop") {
    $("#modalBackdrop").classList.remove("show");
  }
});

// Demo actions used by buttons across the dashboard
function action(type) {
  const content = {
    request: [
      "Request money",
      "Create a secure payment request and share it with someone.",
      "Create request"
    ],
    deposit: [
      "Add funds",
      "This portfolio demo can simulate a top-up flow. A real implementation would connect to a regulated payment provider.",
      "Continue"
    ],
    freeze: [
      "Freeze your card",
      "Your card is currently active. In a real banking system this control would immediately block new card transactions.",
      "Freeze card"
    ],
    goal: [
      "Savings goal",
      "Your New laptop fund is 68.4% complete. Keep building your balance toward ETB 100,000.",
      "Add to goal"
    ],
    newAccount: [
      "Add account",
      "Choose the account type you want to add to your NexaBank profile.",
      "Continue"
    ],
    newCard: [
      "Create virtual card",
      "A new virtual card can be created after identity and security checks in a production system.",
      "Create card"
    ],
    limits: [
      "Spending limits",
      "Current daily card limit: ETB 50,000. Production banking systems would apply server-side controls.",
      "Update limits"
    ],
    pin: [
      "Change PIN",
      "For this portfolio demo, PIN changes are represented as a secure flow only.",
      "Start"
    ],
    save: [
      "Profile saved",
      "Your demo profile changes have been saved locally.",
      "Close"
    ]
  }[type] || [
    "NexaBank",
    "This is a frontend portfolio experience. Real banking actions require a secure backend and regulated integrations.",
    "Close"
  ];

  modal(`
    <h3>${content[0]}</h3>
    <p>${content[1]}</p>
    <div class="modal-actions">
      <button class="outline-btn" id="modalCancel">Cancel</button>
      <button class="primary-btn" id="modalConfirm">${content[2]}</button>
    </div>
  `);

  $("#modalCancel").onclick = () => {
    $("#modalBackdrop").classList.remove("show");
  };

  $("#modalConfirm").onclick = () => {
    $("#modalBackdrop").classList.remove("show");
    toast(content[2], "Demo action completed.");
  };
}

$$('[data-action]').forEach((button) => {
  button.addEventListener("click", () => action(button.dataset.action));
});

$("#sendTransfer").addEventListener("click", () => {
  const amount = Number($("#transferAmount").value);
  const recipient = $("#recipient").value;

  if (!amount || amount <= 0 || recipient === "Choose recipient...") {
    toast("Check transfer details", "Choose a recipient and enter a valid amount.");
    return;
  }

  modal(`
    <h3>Review transfer</h3>
    <p>
      You are about to send <b>ETB ${amount.toLocaleString()}</b> to
      <b>${recipient.split(" •")[0]}</b>. This is a simulated banking flow.
    </p>
    <div class="modal-actions">
      <button class="outline-btn" id="modalCancel">Edit</button>
      <button class="primary-btn" id="modalConfirm">Confirm transfer</button>
    </div>
  `);

  $("#modalCancel").onclick = () => {
    $("#modalBackdrop").classList.remove("show");
  };

  $("#modalConfirm").onclick = () => {
    $("#modalBackdrop").classList.remove("show");
    toast("Transfer simulated", "No real money was moved in this demo.");
    $("#transferAmount").value = "";
    $("#transferNote").value = "";
  };
});

$$('[data-fill]').forEach((button) => {
  button.addEventListener("click", () => {
    showPage("transfers");

    const option = [...$("#recipient").options].find((item) =>
      item.textContent.startsWith(button.dataset.fill)
    );

    $("#recipient").value = option?.textContent || "Choose recipient...";
  });
});

$("#notificationBtn").addEventListener("click", () =>
  modal(`
    <h3>Notifications</h3>
    <p>
      • Your salary deposit of ETB 72,450 was received today.<br><br>
      • Your security score is 92/100.<br><br>
      • New laptop savings goal is 68.4% complete.
    </p>
    <button class="primary-btn wide" id="modalConfirm">Mark all as read</button>
  `)
);

$("#profileBtn").addEventListener("click", () => showPage("settings"));

$("#downloadCsv").addEventListener("click", () => {
  const csv =
    "Transaction,Details,Type,Amount\\n" +
    txs
      .map(
        (transaction) =>
          `"${transaction.name}","${transaction.meta}","${transaction.type}","${transaction.amount}"`
      )
      .join("\\n");

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "nexabank-statement.csv";
  link.click();

  URL.revokeObjectURL(link.href);
  toast("Statement ready", "CSV downloaded to your device.");
});

$("#chartRange").addEventListener("change", (event) => {
  toast("Chart updated", event.target.value + " selected.");
});
