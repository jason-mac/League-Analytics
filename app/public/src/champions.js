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
    console.log(data);

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

  const response = await fetch(
    `/filterChampions?cCID=${cCid}&cClass=${cClass}&cRace=${cRace}`,
    {
      method: "GET",
    },
  );

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
  try {
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
          "Hide Table",
          "Show Table",
          null,
        );
      });
    document
      .getElementById("filterChampions")
      .addEventListener("submit", filterChampions);
    document
      .getElementById("selectChampionTableButton")
      .addEventListener("click", (e) => displaySelectTable(e, "champion"));
  } catch (e) {
    console.log(e.message);
  }
};
