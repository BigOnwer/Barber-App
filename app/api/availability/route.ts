
import { generateTimeSlots } from "@/lib/generate-time-slots"
import { NextRequest, NextResponse } from "next/server"
import { startOfDay, setHours, setMinutes } from "date-fns"
import prisma from "@/lib/prisma"

const ALL_TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
        return NextResponse.json(
            { error: "Data é obrigatória" }, 
            { status: 400 }
        )
    }

    try {
        // Buscar todos os agendamentos para a data específica
        const existingAppointments = await prisma.appointment.findMany({
            where: {
                date: {
                    startsWith: date // busca por data no formato YYYY-MM-DD
                }
            },
            select: {
                date: true
            }
        })

        // Extrair apenas os horários ocupados
        const occupiedTimes = existingAppointments.map(appointment => {
            const [, time] = appointment.date.split(' ')
            return time
        })

        // Filtrar horários disponíveis
        const availableTimeSlots = ALL_TIME_SLOTS.filter(
            time => !occupiedTimes.includes(time)
        )

        return NextResponse.json({
            date,
            availableTimeSlots,
            occupiedTimes
        })

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
