import batchSetProperty from './batchStyle'

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max)
const round = (v, precision = 3) => parseFloat(v.toFixed(precision))
const adjust = (v, fMin, fMax, tMin, tMax) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin))

export function setProfileVars(el, percentX, percentY) {
  if (!el) return

  const centerX = percentX - 50
  const centerY = percentY - 50

  const percentXDiv100 = percentX * 0.01
  const percentYDiv100 = percentY * 0.01
  const centerDist = Math.hypot(centerY, centerX)
  const pointerFromCenter = clamp(centerDist * 0.02, 0, 1)

  batchSetProperty(el, '--pointer-x', `${percentX}%`)
  batchSetProperty(el, '--pointer-y', `${percentY}%`)
  batchSetProperty(el, '--background-x', `${adjust(percentX, 0, 100, 35, 65)}%`)
  batchSetProperty(el, '--background-y', `${adjust(percentY, 0, 100, 35, 65)}%`)
  batchSetProperty(el, '--pointer-from-center', `${pointerFromCenter}`)
  batchSetProperty(el, '--pointer-from-top', `${percentYDiv100}`)
  batchSetProperty(el, '--pointer-from-left', `${percentXDiv100}`)
  batchSetProperty(el, '--rotate-x', `${round(-centerX * 0.2)}deg`)
  batchSetProperty(el, '--rotate-y', `${round(centerY * 0.25)}deg`)
}

export default setProfileVars
