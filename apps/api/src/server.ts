import "dotenv/config"
import cors from "cors"
import express from "express"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "contxt-legacy-api" })
})

app.get("/api/usage", (_req, res) => {
  res.json({ legacy: true, message: "Contxt stores MVP memory locally in the extension via Dexie/IndexedDB." })
})

app.listen(8787, () => console.log("Legacy Contxt API running on :8787"))
