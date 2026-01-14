"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Scissors, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDay, formatHour } from "@/lib/formatDate"
import { toast } from "sonner"

interface Appoinment {
  id: string
  clientName: string
  date: string
  name: string
}

export default function MyAppoinments() {
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

  async function excluirAgendamento(id: string) {
    const agendamentosAtualizados = agendamentosHoje.filter((a) => a.id !== id)
    localStorage.setItem("appointments", JSON.stringify(agendamentosAtualizados))
    setAgendamentosHoje(agendamentosAtualizados)
    
    await fetch("/api/admin/appointments", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    carregarAgendamentosHoje()

    toast.success('Agendamento Excluido')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Voltar</span>
            </Link>
            <div className="flex items-center gap-3">
              <Scissors className="w-8 h-8 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">BarberShop</h1>
            </div>
            <Link href="/schedule">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">Novo Agendamento</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Meus Agendamentos</h2>
            <p className="text-slate-400">Visualize e gerencie seus horários</p>
          </div>

          {agendamentosHoje.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="py-16 text-center">
                <Scissors className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum agendamento encontrado</h3>
                <p className="text-slate-400 mb-6">Você ainda não tem nenhum horário agendado</p>
                <Link href="/schedule">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">Agendar Agora</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {agendamentosHoje.map((agendamentosHoje) => (
                <Card key={agendamentosHoje.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-white">{agendamentosHoje.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 text-slate-400">
                          <Scissors className="w-4 h-4" />
                          {formatDay(agendamentosHoje.date)} às {formatHour(agendamentosHoje.date)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => excluirAgendamento(agendamentosHoje.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
