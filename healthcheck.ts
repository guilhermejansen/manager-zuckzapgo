const HOST = Bun.env.HOSTNAME || "localhost"
const PORT = Bun.env.PORT || "3000"
const TIMEOUT = 5000

async function performHealthCheck(): Promise<void> {
  const url = `http://${HOST}:${PORT}/`
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)
    const response = await fetch(url, { method: "GET", signal: controller.signal })
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    const isHealthy = response.status >= 200 && response.status < 400

    if (isHealthy) {
      console.log(`[HEALTHCHECK] OK - Status: ${response.status}, Response time: ${responseTime}ms`)
      process.exit(0)
    } else {
      console.error(`[HEALTHCHECK] FAILED - Status: ${response.status}`)
      process.exit(1)
    }
  } catch (error) {
    console.error(`[HEALTHCHECK] ERROR - ${error instanceof Error ? error.message : "Unknown"}`)
    process.exit(1)
  }
}

performHealthCheck()
