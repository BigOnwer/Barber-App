import prisma from "@/lib/prisma"

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: {
      service: true,
    },
    orderBy: {
      date: "asc",
    },
  })

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)


  await prisma.appointment.deleteMany({
    where: {
      date: {
        lt: new Date().toISOString()
      }
    }
  })

  return Response.json(appointments)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()

  await prisma.appointment.delete({
    where: { id },
  })

  return Response.json({ ok: true })
}

export async function PUT(req: Request) {
  const body = await req.json()

  const appointment = await prisma.appointment.update({
    where: { id: body.id },
    data: {
      date: body.date,
      serviceId: body.serviceId,
    },
  })

  return Response.json(appointment)
}
