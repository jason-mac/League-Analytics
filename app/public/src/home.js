async function checkDbConnection() {
  const statusElem = document.getElementById("dbStatus");
  const loadingGifElem = document.getElementById("loadingGif");

  const response = await fetch("/check-db-connection", {
    method: "GET",
  });

  loadingGifElem.style.display = "none";
  statusElem.style.display = "inline";

  response
    .text()
    .then((text) => {
      statusElem.textContent = text;
    })
    .catch((error) => {
      statusElem.textContent = "connection timed out";
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


async function deleteSummonerSpell(event) {
  event.preventDefault();

  const id = document.getElementById("deleteSSID").value;

  const response = await fetch("/summonerSpell", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summonSpellID: id,
    }),
  });

  const data = await response.json();
  const messageElement = document.getElementById("deleteSSMsg");

  if (data.success) {
    messageElement.textContent = "Data updated successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error updating data!";
  }
}

async function findPlayersUseAllSS(event) {
  event.preventDefault();

  const response = await fetch("/playersUseAllSS", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  const messageElement = document.getElementById("findPlayerUseAllSSMsg");
  const tableElement = document.getElementById("playersWhoUseAllSS");
  const tableBody = tableElement.querySelector("tbody");

  if (data.success) {
    messageElement.textContent = "Data retrieved successfully!";
    if (tableBody) {
      tableBody.innerHTML = "";
    }

    const info = data.data;

    info.forEach((element) => {
      const row = tableBody.insertRow();
      element.forEach((field, index) => {
        const cell = row.insertCell(index);
        cell.textContent = field;
      });
    });
  } else {
    messageElement.textContent = "Error retrieving data!";
  }
}

window.onload = function () {
  checkDbConnection();
  fetchTableData();
  try {
    document
      .getElementById("deleteSS")
      .addEventListener("submit", deleteSummonerSpell);
    document
      .getElementById("findPlayersUseAllSS")
      .addEventListener("submit", findPlayersUseAllSS)
  } catch (e) {
    console.log(e.message);
  }
};

function fetchTableData() {
  const tableNames = [
    "playedintable",
    "ssTable",
  ];
  for (const tableName of tableNames) {
    fetchAndDisplayTable(tableName);
  }
}
