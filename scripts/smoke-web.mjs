const baseUrl = process.env.CONTXT_SMOKE_URL || process.env.APP_URL || "http://localhost:3000"

const checks = [
  { name: "landing", url: `${baseUrl}/` },
  { name: "health", url: `${baseUrl}/api/health` }
]

for (const check of checks) {
  const response = await fetch(check.url, { redirect: "follow" })
  if (!response.ok) {
    throw new Error(`${check.name} failed: ${response.status} ${response.statusText}`)
  }

  if (check.name === "health") {
    const body = await response.json()
    if (!body.ok || body.service !== "contxt-web") {
      throw new Error(`health returned unexpected body: ${JSON.stringify(body)}`)
    }
  }

  console.log(`${check.name}: ok`)
}
