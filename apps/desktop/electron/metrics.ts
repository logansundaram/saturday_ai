import si from 'systeminformation'

export async function getSystemMetrics() {
  const [cpu, cpuLoad, mem, graphics] = await Promise.all([
    si.cpu(),
    si.currentLoad(),
    si.mem(),
    si.graphics(),
  ])

  const gpu = graphics.controllers[0]

  return {
    cpuModel: `${cpu.manufacturer} ${cpu.brand}`.trim(),
    cpuCores: cpu.cores,
    cpuUsage: Math.round(cpuLoad.currentLoad),
    memoryTotal: mem.total,
    memoryUsed: mem.active,
    gpuModel: gpu?.model ?? null,
    gpuUsage: gpu?.utilizationGpu ?? null,
    timestamp: Date.now(),
  }
}
