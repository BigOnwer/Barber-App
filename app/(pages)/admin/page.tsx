"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Check, Clock, Edit, FileText, Filter, RefreshCw, Scissors, Search, Trash2, User, X } from "lucide-react"
import { formatDay, formatDayAndHour } from "@/lib/formatDate"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { startOfDay } from "date-fns"
import { useRouter } from "next/navigation"
import { Service } from "./component/service"

interface Appointment {
  id: number;
  service: string;
  date: string;
  name: string;
  dateOnly: string;
  timeOnly: string;
  formattedDate: string;
  formattedTime: string;
}

interface EditForm {
  id?: number;
  service?: string;
  date?: string;
  name?: string;
}

export default function AdminPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [appointments, setAppointments] = useState<any[]>([])
  const router = useRouter()

  function load() {
    fetch("/api/admin/appointments")
      .then(res => res.json())
      .then(setAppointments)
  }

  useEffect(() => {
    load()
  }, [])

  async function remove(id: string) {
    await fetch("/api/admin/appointments", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
    load()
  }

  const today = startOfDay(new Date())
  const totalAppointments = appointments.length

  const todayAppointments = appointments.filter(a => {
  const appointmentDate = startOfDay(new Date(a.date))
    return appointmentDate.getTime() === today.getTime()
  })

  const pendingAppointments = appointments.filter(a => {
  const appointmentDate = startOfDay(new Date(a.date))
    return appointmentDate.getTime() > today.getTime()
  })

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
              <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
            </div>
            <div className="flex justify-center">
              <Service/>
              <Button
                variant="outline"
                size="sm"
                onClick={router.refresh}
                className="border-slate-600 text-slate-200 hover:bg-slate-800 bg-transparent rounded-l-none"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Gerenciar Agendamentos</h2>
            <p className="text-slate-400">Visualize e administre todos os horários agendados</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">Total</CardDescription>
                <CardTitle className="text-3xl text-white">{totalAppointments}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">Pendentes</CardDescription>
                <CardTitle className="text-3xl text-yellow-500">{pendingAppointments.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">Hoje</CardDescription>
                <CardTitle className="text-3xl text-green-500">{todayAppointments.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {appointments.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="py-16 text-center">
                <Scissors className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum agendamento encontrado</h3>
                <p className="text-slate-400">
                  {filtroStatus === "todos"
                    ? "Ainda não há agendamentos no sistema"
                    : `Não há agendamentos com status "${filtroStatus}"`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map(a => (
                <Card key={a.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-white">{a.service.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 text-slate-400">
                          <span className="font-semibold">{a.name}</span>
                        </CardDescription>
                        <CardDescription className="flex items-center gap-2 mt-1 text-slate-400">
                          <Scissors className="w-4 h-4" />
                          {formatDayAndHour(a.date)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(a.id)}
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
