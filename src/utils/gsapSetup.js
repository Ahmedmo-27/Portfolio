import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function ensureGsap() {
  if (registered) return { gsap, ScrollTrigger }
  gsap.registerPlugin(useGSAP, ScrollTrigger)
  registered = true
  return { gsap, ScrollTrigger }
}

ensureGsap()

export { gsap, ScrollTrigger }
