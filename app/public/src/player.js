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

// Inserts new records into the player table.
async function insertPlayer(event) {
  event.preventDefault();

  const idValue = document.getElementById("insertPlayerID").value;
  const countryValue = document.getElementById("insertPlayerCountry").value;
  const dateCreatedValue = document.getElementById(
    "insertPlayerDateCreated",
  ).value;
  const emailValue = document.getElementById("insertPlayerEmail").value;

  const response = await fetch("/insertPlayer", {
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

async function fetchPlayerWinRate() {
  const tableElement = document.getElementById("playerWinRateTable");
  const tableBody = tableElement.querySelector("tbody");

  if (!tableElement) {
    console.error(`Table with id playerWinRateTable not found.`);
    return;
  }

  const response = await fetch("/playerWinRate", {
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


async function fetchPlayerAvgKda() {
  const tableElement = document.getElementById("playerAvgKdaTable");
  const tableBody = tableElement.querySelector("tbody");

  if (!tableElement) {
    console.error(`Table with id playerAvgKdaTable not found.`);
    return;
  }

  const response = await fetch("/playerAvgKda", {
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

async function playerRegionCountData(event) {
  event.preventDefault();
  const tableElement = document.getElementById("regionPlayerCountTable");
  const tableBody = tableElement.querySelector("tbody");

  if (!tableElement) {
    console.error(`Table with id regionPlayerCountTable not found.`);
    return;
  }

  const numInput = document.getElementById("minPlayerCount");
  const num = numInput.value;

  const response = await fetch(`/playerRegionCount?num=${num}`, {
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
      .getElementById("insertPlayerTable")
      .addEventListener("submit", insertPlayer);
    document
      .getElementById("updatePlayerEmail")
      .addEventListener("submit", updatePlayer);
    document
      .getElementById("fetchPlayerWinRate")
      .addEventListener("click", function () {
        toggleButton(
          this,
          "playerWinRateTable",
          "playerWinRateMsg",
          "Close",
          "Display Win Rates",
          fetchPlayerWinRate,
        );
      });
    document
      .getElementById("fetchPlayerKda")
      .addEventListener("click", function () {
        toggleButton(
          this,
          "playerAvgKdaTable",
          "playersAvgKdaMsg",
          "Close",
          "Display Avergage KDA",
          fetchPlayerAvgKda,
        );
      });
    document
      .getElementById("fetchPlayerRegionCountData")
      .addEventListener("submit", playerRegionCountData);
    document
      .getElementById("playerTableToggle")
      .addEventListener("click", function () {
        toggleButton(
          this,
          "playerTable",
          "playerTableMsg",
          "Hide",
          "Show Players Table",
          null,
        );
      });
  } catch (e) {
    console.log(e.message);
  }
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
  // Add table name for fetching more tables, ensure to add router function in appController file
  const tableNames = [
    "playerTable",
  ];
  for (const tableName of tableNames) {
    fetchAndDisplayTable(tableName);
  }
}

