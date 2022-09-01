const { connectMiddleware } = require("blitz")
const Cors = require("cors")

const cors = Cors({
  methods: ["GET", "POST", "HEAD", "OPTIONS"],
})

module.exports = {
  middleware: [connectMiddleware(cors)],
}
