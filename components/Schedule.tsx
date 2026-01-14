"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

export function ScheduleClient({
  serviceId,
}: {
  serviceId: string
}) {
  const [date, setDate] = useState<Date>()
  const [slots, setSlots] = useState<Date[]>([])

  useEffect(() => {
    if (!date) return

    fetch(
      `/api/availability?date=${date.toISOString()}&serviceId=${serviceId}`
    )
      .then(res => res.json())
      .then(setSlots)
  }, [date, serviceId])

  return (
    <div className="flex gap-8">
      <Calendar mode="single" selected={date} onSelect={setDate} />

      <div className="grid grid-cols-3 gap-2">
        {slots.map(slot => (
          <Button key={slot.toString()}>
            {new Date(slot).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Button>
        ))}
      </div>
    </div>
  )
}
