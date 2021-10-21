const router = require("express").Router();
const Distance = require("../controllers/distanceMatrixCtrl");

router.post("/get", Distance.get_closest);

module.exports = router;
