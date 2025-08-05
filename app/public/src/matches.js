function toggleButton(button, tableId, msgId, onText, offText, fetchFunction) {
  const table = document.getElementById(tableId);
  const msg = document.getElementById(msgId);

  if (table.style.display === "none" || table.style.display === "") {
    table.style.display = "table";
    if (typeof fetchFunction === "function") {
      fetchFunction();
    }
    console.log("hi");
    button.textContent = onText; // hide table
  } else {
    table.style.display = "none";
    button.textContent = offText; // show table
    msg.textContent = "";
  }
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

async function fetchPlayerPlayedInJoin(event) {
  event.preventDefault();

  const playerID = document.getElementById("playerPlayedInID").value;
  const tableBody = document.querySelector("#playerPlayedInTable tbody");
  const msgDiv = document.getElementById("joinPlayerPlayedInMsg");

  if (!playerID) {
    console.log(`No playerID given`);
    return;
  }

  const response = await fetch(`/joinPlayersPlayedIn?playerID=${playerID}`, {
    method: "GET",
  });
  const responseData = await response.json();
  const data = responseData.data;
  if (!data || data.length === 0) {
    tableBody.innerHTML = "";
    msgDiv.textContent = "User Not Found!";
    return;
  } else {
    msgDiv.textContent = "";
  }

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
  const tableNames = ["match", "gamePerformance", "playedIn"];
  for (const tableName of tableNames) {
    console.log(`${tableName}SelectTableButton`);
    try {
      document
        .getElementById(`${tableName}SelectTableButton`)
        .addEventListener("click", (e) => displaySelectTable(e, tableName));
    } catch (e) {
      console.log(e.message);
    }
  }

  try {
    document
      .getElementById("searchPlayerButton")
      .addEventListener("click", fetchPlayerPlayedInJoin);
  } catch (e) {
    console.log(e.message);
  }
};
