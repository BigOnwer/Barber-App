import prisma from "@/lib/prisma"

export async function GET() {
  const services = await prisma.service.findMany()
  return Response.json(services)
}

export async function POST(req: Request) {
  const body = await req.json()

  const service = await prisma.service.create({
    data: {
      name: body.name,
      price: body.price,
      duration: body.duration,
    },
  })

  return Response.json(service)
}