async function displaySelectChampionTable(event) {
  event.preventDefault();

  // Get selected attributes
  const select = document.getElementById("championAttributesSelect");
  const selectedAttributes = Array.from(select.selectedOptions).map(
    (option) => option.value,
  );

  const attributesMap = new Map([
    ["championID", "Champion ID"],
    ["class", "Class"],
    ["race", "Race"],
  ]);

  try {
    const response = await fetch(`/championTable`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attributes: selectedAttributes }),
    });

    const json = await response.json();
    const data = json.data;
    console.log(data);

    const table = document.getElementById("championTable");
    const tbody = table.querySelector("tbody");
    const thead = table.getElementsByTagName("thead")[0];
    tbody.innerHTML = ""; // Clear old rows
    thead.innerHTML = ""; // clear old headers

    let headerRow = thead.querySelector("tr");
    if (headerRow == null || !headerRow) {
      headerRow = document.createElement("tr");
      thead.appendChild(headerRow);
    }

    const addColumn = function (attribute) {
      let newColumn = document.createElement("th");
      newColumn.textContent = attribute;
      headerRow.appendChild(newColumn);
    };

    // dynamically build the table header
    for (const selectedAttribute of selectedAttributes) {
      addColumn(attributesMap.get(selectedAttribute));
    }

    // building the actual table
    for (const rowData of data) {
      const newRow = document.createElement("tr");
      for (const cellData of rowData) {
        const newCell = document.createElement("td");
        newCell.textContent = cellData;
        newRow.appendChild(newCell);
      }
      console.log("row of dtta ");
      tbody.appendChild(newRow);
    }

    table.style.display = "table"; // Show table
    document.getElementById("championTableMsg").textContent = "";
    document.getElementById("championTableToggle").textContent = "Hide Table";
  } catch (err) {
    console.error(err);
    document.getElementById("championTableMsg").textContent =
      "Failed to load Champions.";
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
      .addEventListener("click", displaySelectChampionTable);
  } catch (e) {
    console.log(e.message);
  }
};
