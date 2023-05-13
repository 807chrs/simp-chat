const {
  addMessage,
  getAllMessages,
} = require("../controllers/messageControllers");

const router = require("express").Router();

router.post("/addMessage", addMessage);
router.post("/getAllMessages", getAllMessages);

module.exports = router;
