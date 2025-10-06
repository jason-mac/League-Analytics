const express = require("express");
const appService = require("./appService");

const router = express.Router();

router.get("/check-db-connection", async (req, res) => {
  const isConnect = await appService.testPostgresConnection();
  if (isConnect) {
    res.send("connected");
  } else {
    res.send("unable to connect");
  }
});

router.post("/matchTable", async (req, res) => {
  const { attributes } = req.body;
  const tableContent = await appService.fetchMatchTableDataFromDb(attributes);
  res.json({ data: tableContent });
});

router.post("/playerTable", async (req, res) => {
  const { attributes } = req.body;
  const tableContent = await appService.fetchPlayerTableDataFromDb(attributes);
  res.json({ data: tableContent });
});

router.post("/championTable", async (req, res) => {
  const { attributes } = req.body;
  const tableContent =
    await appService.fetchChampionTableDataFromDb(attributes);
  res.json({ data: tableContent });
});

router.post("/playedInTable", async (req, res) => {
  const { attributes } = req.body;
  const tableContent =
    await appService.fetchPlayedInTableDataFromDb(attributes);
  res.json({ data: tableContent });
});

router.post("/gamePerformanceTable", async (req, res) => {
  const { attributes } = req.body;
  const tableContent =
    await appService.fetchGamePerformanceTableDataFromDb(attributes);
  res.json({ data: tableContent });
});

router.post("/ssTable", async (req, res) => {
  const { attributes } = req.body;
  const tableContent =
    await appService.fetchSummonerSpellTableDataFromDb(attributes);
  res.json({ data: tableContent });
});

router.get("/playerBuildsItemTable", async (req, res) => {
  const tableContent =
    await appService.fetchTableDataFromDb("PlayerBuildsItems");
  res.json({ data: tableContent });
});

router.post("/insertPlayer", async (req, res) => {
  const { playerId, country, dateCreated, email } = req.body;
  const insertResult = await appService.insertPlayer(
    playerId,
    country,
    dateCreated,
    email,
  );
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insertChampion", async (req, res) => {
  const { championId, championClass, race } = req.body;
  const insertResult = await appService.insertChampion(
    championId,
    championClass,
    race,
  );
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/updatePlayer", async (req, res) => {
  const { playerID, email, dateCreated, country } = req.body;
  if (!email && !dateCreated && !country) {
    return res.json({
      success: true,
      message: "All fields were empty, no changes were made",
    });
  }

  const result = await appService.updatePlayer(
    playerID,
    email,
    dateCreated,
    country,
  );
  if (result) {
    res.json({
      success: true,
      message: "Data updated successfully!",
    });
  } else {
    res.status(500).json({
      success: false,
    });
  }
});

router.post("/updateChampionClass", async (req, res) => {
  const { playerId, championClass } = req.body;
  const result = await appService.updateChampion(playerId, championClass);

  if (result) {
    res.json({
      success: true,
    });
  } else {
    res.status(500).json({
      success: false,
    });
  }
});

router.get("/playerRegionCount", async (req, res) => {
  const num = parseInt(req.query.num) || 0;
  const result = await appService.fetchNumPlayersByRegionDataFromDb(num);
  res.json({ data: result });
});

router.get("/playerAvgKda", async (req, res) => {
  const tableContent = await appService.fetchPlayerAvgKda();
  res.json({ data: tableContent });
});

router.get("/playerWinRate", async (req, res) => {
  const tableContent = await appService.fetchPlayersWinRate();
  res.json({ data: tableContent });
});

router.get("/championBanRate", async (req, res) => {
  const tableContent = await appService.fetchChampionBanRate();
  res.json({ data: tableContent });
});

router.get("/joinPlayersPlayedIn", async (req, res) => {
  const { playerID } = req.query;
  const result = await appService.joinPlayersPlayedIn(playerID);

  if (result && result.length > 0) {
    res.json({
      success: true,
      data: result,
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }
});

router.delete("/summonerSpell", async (req, res) => {
  const { summonSpellID } = req.body;
  const result = await appService.deleteSummonerSpell(summonSpellID);
  if (result) {
    res.json({
      success: true,
      data: result,
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }
});

router.get("/playersUseAllSS", async (req, res) => {
  const result = await appService.findPlayersUseAllSS();

  if (result === false) {
    res.status(400).json({
      success: false,
    });
  } else {
    res.json({
      success: true,
      data: result,
    });
  }
});

router.get("/filterChampions", async (req, res) => {
  const { cCID, cClass, cRace } = req.query;
  const result = await appService.filterChampions(cCID, cClass, cRace);

  if (result && result.length > 0) {
    res.json({
      success: true,
      data: result,
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }
});

module.exports = router;
