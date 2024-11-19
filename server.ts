import { readFileSync } from "fs"
import { createServer } from "https"
import { join } from "path"
import { parse } from "url"
import dotenv from "dotenv"
import next from "next"
dotenv.config({ path: ".env" })

// 開発モードか本番モードかを判定
const dev = process.env.NODE_ENV !== "production"

const app = next({ dev })
const handle = app.getRequestHandler()

// HTTPS証明書のオプション
const httpsOptions = {
  key: readFileSync(join(process.cwd(), "certificates", "localhost-key.pem")),
  cert: readFileSync(join(process.cwd(), "certificates", "localhost.pem")),
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url || "", true)
    handle(req, res, parsedUrl)
  }).listen(3000, () => {
    console.log("Server running on https://localhost:3000")
  })
})
