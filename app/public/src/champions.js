async function checkDbConnection() {
  const statusElem = document.getElementById("dbStatus");
  const loadingGifElem = document.getElementById("loadingGif");

  const response = await fetch("/check-db-connection", {
    method: "GET",
  });

  // Hide the loading GIF once the response is received.
  loadingGifElem.style.display = "none";
  // Display the statusElem's text in the placeholder.
  statusElem.style.display = "inline";

  response
    .text()
    .then((text) => {
      statusElem.textContent = text;
    })
    .catch((error) => {
      statusElem.textContent = "connection timed out"; // Adjust error handling if required.
    });
}

async function fetchAndDisplayTable(tableid) {
  const tableElement = document.getElementById(tableid);
  const tableBody = tableElement.querySelector("tbody");

  if (!tableElement) {
    console.error(`Table with id ${tableid} not found.`);
    return;
  }

  const response = await fetch("/" + tableid, {
    method: "GET",
  });

  const responseData = await response.json();
  const data = responseData.data;

  // Always clear old, already fetched data before new fetching process.
  if (tableBody) {
    tableBody.innerHTML = "";
  }

  data.forEach((element) => {
    const row = tableBody.insertRow();
    element.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

function toggleButton(button, tableId, msgId, onText, offText, fetchFunction) {
  const table = document.getElementById(tableId);
  const msg = document.getElementById(msgId);

  if (table.style.display === "none" || table.style.display === "") {
    table.style.display = "table";
    if (typeof fetchFunction === "function") {
      fetchFunction();
    }

    button.textContent = onText; // hide table
  } else {
    table.style.display = "none";
    button.textContent = offText; // show table
    msg.textContent = "";
  }
}

async function fetchChampionBanRate() {
  const tableName = "championBanRateTable";
  const tableElement = document.getElementById(tableName);
  const tableBody = tableElement.querySelector("tbody");

  console.log("avg kda ");

  if (!tableElement) {
    console.error(`Table with id ${tableName} not found.`);
    return;
  }
  console.log("avg kda ");

  const response = await fetch("/championBanRate", {
    method: "GET",
  });

  const responseData = await response.json();
  const data = responseData.data;

  // Always clear old, already fetched data before new fetching process.
  if (tableBody) {
    tableBody.innerHTML = "";
  }

  data.forEach((element) => {
    const row = tableBody.insertRow();
    element.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

async function filterChampions(event) {
  event.preventDefault();

  const cCid = document.getElementById("filterChampionID").value;
  const cClass = document.getElementById("filterClass").value;
  const cRace = document.getElementById("filterRace").value;

  const tableBody = document.querySelector("#filterChampionsTable tbody");


  const response = await fetch(`/filterChampions?cID=${cCid}&cClass=${cClass}&cRace=${cRace}`, {
    method: "GET",
  });

  const responseData = await response.json();
  const data = responseData.data;

  if (tableBody) {
    tableBody.innerHTML = "";
  }

  data.forEach((element) => {
    const row = tableBody.insertRow();
    element.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}


window.onload = function () {
  checkDbConnection();
  fetchTableData();
  try {
    document
      .getElementById("insertChampion")
      .addEventListener("submit", insertChampion);
    document
      .getElementById("fetchChampionBanRate")
      .addEventListener("click", function () {
        toggleButton(
          this,
          "championBanRateTable",
          "championBanRateMsg",
          "Close",
          "Display Ban Rates",
          fetchChampionBanRate,
        );
      });
      document
      .getElementById("championTableToggle")
      .addEventListener("click", function () {
        toggleButton(
          this,
          "championTable",
          "championTableMsg",
          "Hide",
          "Show Champions Table",
          null,
        );
      });
      document
        .getElementById("filterChampions")
        .addEventListener("submit", filterChampions)
  } catch (e) {
    console.log(e.message);
  }
};

function fetchTableData() {
  // Add table name for fetching more tables, ensure to add router function in appController file
  const tableNames = [
    "championTable",
  ];
  for (const tableName of tableNames) {
    fetchAndDisplayTable(tableName);
  }
}
