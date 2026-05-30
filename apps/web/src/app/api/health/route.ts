import { getWebEnvStatus } from "../../../lib/env"

export async function GET() {
  return Response.json({ ok: true, service: "contxt-web", env: getWebEnvStatus() })
}
