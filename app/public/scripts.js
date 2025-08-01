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

async function fetchMatchHistory(event) {
  event.preventDefault();

  const tableElement = document.getElementById("matchHistory");
  const tableBody = tableElement.querySelector("tbody");

  const playerIdValue = document.getElementById("championIdMatchHistory");
  const championIdValue = document.getElementById("playerIdMatchHistory");
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

// This function resets or initializes the demotable.
async function resetDemotable() {
  const response = await fetch("/initiate-demotable", {
    method: "POST",
  });
  const responseData = await response.json();

  if (responseData.success) {
    const messageElement = document.getElementById("resetResultMsg");
    messageElement.textContent = "demotable initiated successfully!";
    fetchTableData();
  } else {
    alert("Error initiating table!");
  }
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

// Inserts new records into the demotable.
async function insertDemotable(event) {
  event.preventDefault();

  const idValue = document.getElementById("insertId").value;
  const nameValue = document.getElementById("insertName").value;

  const response = await fetch("/insert-demotable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: idValue,
      name: nameValue,
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

// Updates names in the demotable.
async function updateNameDemotable(event) {
  event.preventDefault();

  const oldNameValue = document.getElementById("updateOldName").value;
  const newNameValue = document.getElementById("updateNewName").value;

  const response = await fetch("/update-name-demotable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldName: oldNameValue,
      newName: newNameValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("updateNameResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Name updated successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error updating name!";
  }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
  const response = await fetch("/count-demotable", {
    method: "GET",
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("countResultMsg");

  if (responseData.success) {
    const tupleCount = responseData.count;
    messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
  } else {
    alert("Error in count demotable!");
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
    .getElementById("resetDemotable")
    .addEventListener("click", resetDemotable);
  document
    .getElementById("insertDemotable")
    .addEventListener("submit", insertDemotable);
  document
    .getElementById("insertPlayerTable")
    .addEventListener("submit", insertPlayer);
  document
    .getElementById("insertChampion")
    .addEventListener("submit", insertChampion);
  document
    .getElementById("matchHistory")
    .addEventListener("submit", fetchMatchHistory);
  document
    .getElementById("updataNameDemotable")
    .addEventListener("submit", updateNameDemotable);
  document
    .getElementById("countDemotable")
    .addEventListener("click", countDemotable);
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
    "players-avg-kda",
  ];
  for (const tableName of tableNames) {
    fetchAndDisplayTable(tableName);
  }
}
