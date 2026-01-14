"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Scissors, Calendar, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDayAndHour } from "@/lib/formatDate"

interface Appoinment {
  id: string
  clientName: string
  date: string
  name: string
}

export default function Home() {
  const [agendamentosHoje, setAgendamentosHoje] = useState<Appoinment[]>([])

  const carregarAgendamentosHoje = () => {
    const appoinment = JSON.parse(localStorage.getItem("appointments") || "[]")
    setAgendamentosHoje(appoinment)
  }

  useEffect(() => {
    carregarAgendamentosHoje()
  }, [])

  useEffect(() => {
    const today = new Date()
    const appointments: Appoinment[] = JSON.parse(localStorage.getItem('appointments') || "[]")
    const filteredItems = appointments.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate > today
    })

    localStorage.setItem("appointments", JSON.stringify(filteredItems))
  })

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scissors className="w-8 h-8 text-amber-500" />
              <h1 className="text-2xl font-bold text-white hidden sm:block">BarberShop</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/schedule">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">Agendar Horário</Button>
              </Link>
              <Link href="/my-appointments">
                <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 bg-transparent">
                  Meus Agendamentos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Estilo e Tradição em um só Lugar</h2>
                <p className="text-xl text-slate-300 mb-8">
                  Agende seu horário com os melhores profissionais da cidade
                </p>
              </div>

              <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <CardTitle className="text-white">Agendamentos Hoje</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {agendamentosHoje.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p className="text-slate-400 text-sm">Nenhum agendamento para hoje</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {agendamentosHoje.map((agendamento) => (
                        <div key={agendamento.id} className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                          <p className="text-white font-medium text-sm">{agendamento.clientName}</p>
                          <p className="text-slate-400 text-xs">{agendamento.name}</p>
                          <p className="text-slate-400 text-xs">{formatDayAndHour(agendamento.date)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Link href="/schedule" className="block mt-4">
                <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Agendar Agora
                </Button>
              </Link>
            </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Scissors className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">Cortes Modernos</CardTitle>
                    <CardDescription className="text-slate-400">Tendências e estilos clássicos</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">Horários Flexíveis</CardTitle>
                    <CardDescription className="text-slate-400">Agende quando quiser</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">Profissionais</CardTitle>
                    <CardDescription className="text-slate-400">Equipe qualificada</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
