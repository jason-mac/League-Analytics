/*
 * These functions below are for various webpage functionalities.
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 *
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your
 *   backend endpoints
 * and
 *   HTML structure.
 *
 */

// TODO: REMOVE DEBUGGING CONSOLE LOG STATEMENTS WHEN FINISHED

// This function checks the database connection and updates its status on the frontend.
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

// Inserts new records into the player table.
async function insertChampion(event) {
  event.preventDefault();

  const idValue = document.getElementById("insertChampionId").value;
  const classValue = document.getElementById("insertChampionClass").value;
  const raceValue = document.getElementById("insertChampionRace").value;

  console.log("InsertChampion start");
  console.log(classValue);
  console.log(idValue);
  console.log(classValue);
  console.log("InsertChampion end");

  const response = await fetch("/insert-champion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      championId: idValue,
      championClass: classValue,
      race: raceValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("insertResultMsgChampion");

  if (responseData.success) {
    messageElement.textContent = "Data inserted successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error inserting data!";
  }
}

// Inserts new records into the player table.
async function insertPlayer(event) {
  event.preventDefault();

  const idValue = document.getElementById("insertPlayerID").value;
  const countryValue = document.getElementById("insertPlayerCountry").value;
  const dateCreatedValue = document.getElementById(
    "insertPlayerDateCreated",
  ).value;
  const emailValue = document.getElementById("insertPlayerEmail").value;

  console.log("hello");
  console.log(idValue);
  console.log(countryValue);
  console.log(dateCreatedValue);
  console.log(emailValue);

  const response = await fetch("/insert-player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId: idValue,
      country: countryValue,
      dateCreated: dateCreatedValue,
      email: emailValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("insertResultMsgPlayer");

  if (responseData.success) {
    messageElement.textContent = "Data inserted successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error inserting data!";
  }
}

async function updatePlayer(event) {
  event.preventDefault();

  const id = document.getElementById("updatePlayerID").value;
  const email = document.getElementById("updateNewEmail").value;

  const response = await fetch("/updatePlayerEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId: id,
      email: email,
    }),
  });

  const data = await response.json();
  const messageElement = document.getElementById("updateEmailResultMsg");

  if (data.success) {
    messageElement.textContent = "Data updated successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error updating data!";
  }
}

async function updateChampion(event) {
  event.preventDefault();

  const id = document.getElementById("updateChampionID").value;
  const championClass = document.getElementById("updateNewClass").value;

  const response = await fetch("/updateChampionClass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId: id,
      championClass: championClass,
    }),
  });

  const data = await response.json();
  const messageElement = document.getElementById(
    "updateChampionClassResultMsg",
  );

  if (data.success) {
    messageElement.textContent = "Data updated successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error updating data!";
  }
}

async function playerRegionCountData(event) {
  event.preventDefault();
  console.log("ran in here");
  const tableElement = document.getElementById("regionPlayerCountTable");
  const tableBody = tableElement.querySelector("tbody");

  if (!tableElement) {
    console.error(`Table with id regionPlayerCountTable not found.`);
    return;
  }

  const numInput = document.getElementById("minPlayerCount");
  const num = numInput.value;
  console.log(num);

  const response = await fetch(`/player-region-count-data-table?num=${num}`, {
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
// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
  checkDbConnection();
  fetchTableData();
  document
    .getElementById("playerRegionCountData")
    .addEventListener("submit", playerRegionCountData);
  document
    .getElementById("insertPlayerTable")
    .addEventListener("submit", insertPlayer);
  document
    .getElementById("insertChampion")
    .addEventListener("submit", insertChampion);
  document
    .getElementById("updatePlayerEmail")
    .addEventListener("submit", updatePlayer);
  document
    .getElementById("updateChampionClass")
    .addEventListener("submit", updateChampion);
  document
    .getElementById("playerWinRates")
    .addEventListener("click", updateChampion);
  document
    .getElementById("championBanRate")
    .addEventListener("click", updateChampion);
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
  // Add table name for fetching more tables, ensure to add router function in appController file
  const tableNames = [
    "championtable",
    "playertable",
    "playedintable",
    "gameperformancetable",
    "matchtable",
    "demotable",
    // TODO:separate these three into their own functions
    "players-avg-kda",
    "player-win-rate",
    "champion-ban-rate",
  ];
  for (const tableName of tableNames) {
    fetchAndDisplayTable(tableName);
  }
}
