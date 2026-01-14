// lib/generate-time-slots.ts
import { addMinutes, isBefore } from "date-fns"

export function generateTimeSlots(
  start: Date,
  end: Date,
  duration: number
) {
  const slots: Date[] = []
  let current = start

  while (isBefore(current, end)) {
    slots.push(current)
    current = addMinutes(current, duration)
  }

  return slots
}
