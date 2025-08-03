const express = require("express");
const appService = require("./appService");

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

// TODO: REMOVE DEBUGGING CONSOLE LOG STATEMENTS WHEN FINISHED
router.get("/check-db-connection", async (req, res) => {
  const isConnect = await appService.testOracleConnection();
  if (isConnect) {
    res.send("connected");
  } else {
    res.send("unable to connect");
  }
});

router.get("/matchTable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("match");
  res.json({ data: tableContent });
});

router.get("/playerTable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("player");
  res.json({ data: tableContent });
});

router.get("/championTable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("champion");
  res.json({ data: tableContent });
});

router.get("/playedInTable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("playedin");
  res.json({ data: tableContent });
});

router.get("/gamePerformanceTable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("gameperformance");
  res.json({ data: tableContent });
});

router.get("/ssTable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("SummonerSpell");
  res.json({ data: tableContent });
});

router.get("/playerBuildsItemTable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("PlayerBuildsItems");
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

router.post("/updatePlayerEmail", async (req, res) => {
  const { playerId, email } = req.body;
  const result = await appService.updatePlayer(playerId, email);

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
})

router.get("/joinPlayersPlayedIn", async (req, res) => {
	const { playerID } = req.query;
	const result = await appService.joinPlayersPlayedIn(playerID);

	if (result && result.length > 0) {
	res.json({
		success: true,
		data: result
	});
	} else {
		res.status(400).json({
			success: false
	});
	}

});

router.delete("/summonerSpell", async (req, res) => {
	const { summonSpellID } = req.body;
	const result = await appService.deleteSummonerSpell(summonSpellID);
  console.log(result);
	if (result) {
    res.json({
      success: true,
      data: result
    });
	} else {
		res.status(400).json({
			success: false
	});
	}
});

router.get("/playersUseAllSS", async (req, res) => {
	const result = await appService.findPlayersUseAllSS();
  
  if (result === false) {
    res.status(400).json({
			success: false
	  });
  } else {
    res.json({
		  success: true,
		  data: result
	  });
  }
	
});

module.exports = router;
