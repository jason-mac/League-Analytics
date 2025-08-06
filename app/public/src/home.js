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

async function displaySelectTable(event, tableName) {
  event.preventDefault();

  const form = document.getElementById(`${tableName}Attributes`);
  const checkedBoxes = form.querySelectorAll('input[name="attributes"]:checked');

  const selectedAttributes = Array.from(checkedBoxes).map((cb) => cb.value);
  const selectedColumns = [];
  for (const checkBox of checkedBoxes) {
    const selectedColumn = checkBox.parentElement.textContent.trim();
    selectedColumns.push(selectedColumn);
  }

 
  try {
    const response = await fetch(`/${tableName}Table`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attributes: selectedAttributes }),
    });

    const json = await response.json();
    const data = json.data;

    const table = document.getElementById(`${tableName}Table`);
    const tbody = table.querySelector("tbody");
    const thead = table.getElementsByTagName("thead")[0];
    tbody.innerHTML = ""; // Clear old rows
    thead.innerHTML = ""; // clear old headers

    if(checkedBoxes.length == 0) {
      document.getElementById(`${tableName}TableMsg`).textContent = "Please Select At Least One Column!";
      return  
    } else{
      document.getElementById(`${tableName}TableMsg`).textContent = "";
    }

    let headerRow = thead.querySelector("tr");
    if (headerRow == null || !headerRow) {
      headerRow = document.createElement("tr");
      thead.appendChild(headerRow);
    }

    // dynamically create the header row
    for (const selectedColumn of selectedColumns) {
      let newColumn = document.createElement("th");
      newColumn.textContent = selectedColumn;
      headerRow.appendChild(newColumn);
    }

    // building the actual table
    for (const rowData of data) {
      const newRow = document.createElement("tr");
      for (const cellData of rowData) {
        const newCell = document.createElement("td");
        newCell.textContent = cellData;
        newRow.appendChild(newCell);
      }
      tbody.appendChild(newRow);
    }

    table.style.display = "table"; // Show table
    document.getElementById(`${tableName}TableMsg`).textContent = "";
  } catch (err) {
    console.error(err);
    const errorMsgDiv = document.getElementById(`${tableName}TableMsg`);
    errorMsgDiv.textContent = `Failed to load ${tableName} Table.`;
  }
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
  try {
    document
      .getElementById("deleteSS")
      .addEventListener("submit", deleteSummonerSpell);
    document
      .getElementById("findPlayersUseAllSS")
      .addEventListener("submit", findPlayersUseAllSS)
    const tableNames = ["playedIn", "ss"];
    for (const tableName of tableNames) {
      try {
        document
          .getElementById(`${tableName}SelectTableButton`)
          .addEventListener("click", (e) => displaySelectTable(e, tableName));
      } catch (e) {
        console.log(e.message);
      }
    }
  } catch (e) {
    console.log(e.message);
  }
};