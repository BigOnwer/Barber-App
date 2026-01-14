import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {name, date, serviceId} = body

    const exists = await prisma.appointment.findFirst({
        where: {
            date: body.date
        }
    })

    if(exists) {
        return NextResponse.json(
            {message: "horario indisponivel"},
            {status: 400}
        )
    }

    const appointment = await prisma.appointment.create({
        data: {
            name,
            date,
            serviceId
        }
    })

    return NextResponse.json(
        appointment,
        { status: 201 }
    )
}