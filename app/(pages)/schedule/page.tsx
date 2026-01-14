"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CalendarIcon, Clock, Scissors, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Service = {
  id: string
  name: string
  duration: number
  price: number
}

const NewClientFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  serviceId: z.string().min(1, "Selecione um serviço"),
  date: z.date("Selecione uma data",),
  slot: z.date("Selecione um horário"),
})

type NewClientFormInput = z.infer<typeof NewClientFormSchema>

type newClientFormInput = z.infer<typeof NewClientFormSchema>

export default function SchedulePage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState("")
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<newClientFormInput>({
    resolver: zodResolver(NewClientFormSchema),
  });

  const serviceId = watch("serviceId")
  const selectedSlot = watch("slot")
  useEffect(() => {
    setValue('serviceId', selectedService);
  }, [selectedService, setValue]);

  useEffect(() => {
    fetch("/api/services").then(res => res.json()).then(setServices)
  }, [])

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number)

      const combinedDate = new Date(selectedDate)
      combinedDate.setHours(hours, minutes, 0, 0)

      setValue("date", combinedDate)
      setValue("slot", combinedDate)
    }
  }, [selectedDate, selectedTime, setValue])


  const fetchAvailableTimeSlots = async (date: Date) => {
    setLoadingTimeSlots(true)
    try {
      const dateString = date.toISOString().split('T')[0] // formato YYYY-MM-DD
      
      const response = await fetch(`/api/availability?date=${dateString}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar horários disponíveis')
      }
      
      const data = await response.json()
      setAvailableTimeSlots(data.availableTimeSlots || [])
      
    } catch (error) {
      console.error('Erro ao buscar horários:', error)
      alert('Erro ao carregar horários disponíveis')
      setAvailableTimeSlots([])
    } finally {
      setLoadingTimeSlots(false)
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate)
      // Limpar horário selecionado quando muda a data
      setSelectedTime("")
    }
  }, [selectedDate])

  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime("")
      alert('O horário selecionado não está mais disponível')
    }
  }, [availableTimeSlots, selectedTime])

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate)
      // Limpar horário selecionado quando muda a data
      setSelectedTime("")
    }
  }, [selectedDate])

  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime("")
      alert('O horário selecionado não está mais disponível')
    }
  }, [availableTimeSlots, selectedTime])

  async function handleConfirm(data: NewClientFormInput, ) {
    setLoading(true)

    const res = await fetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    })

    const dat = await res.json()
    console.log(dat)

    if (!res.ok) {
      toast.error('Este horário já está ocupado. Por favor, escolha outro horário.')
      router.refresh()
      return(
        setLoading(false)
      )
    }


    const appointmentToSave = {
    clientName: data.name,
    name,
    id: dat.id,
    date: data.date,
    time: data.slot,
  }

    const stored =
      JSON.parse(localStorage.getItem("appointments") || "[]")

    localStorage.setItem(
    "appointments",
    JSON.stringify([...stored, appointmentToSave])
    )
    
    toast.success('criado')
    
    setLoading(false)
  }


  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Voltar</span>
            </Link>
            <div className="flex items-center gap-3">
              <Scissors className="w-8 h-8 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">Geovane Barber</h1>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Agendar Horário</CardTitle>
            <CardDescription className="text-slate-400">Preencha os dados para reservar seu horário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-200">
                <User className="w-4 h-4" />
                Nome Completo
              </Label>
              <Input placeholder="Seu nome" {...register("name")} className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"/>
            </div>
            

            <Card className="bg-transparent border-slate-700 text-white">
              <CardHeader>
                <CardTitle>Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => {
                      setValue("serviceId", service.id)
                      setName(service.name)
                    } }
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      serviceId === service.id
                        ? "border-neutral-500 bg-neutral-200"
                        : "border-gray-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration} min
                        </div>
                      </div>
                      <Badge>R${service.price}</Badge>
                    </div>
                  </div>
                ))}
                {errors.serviceId && (
                  <p className="text-sm text-red-500">{errors.serviceId.message}</p>
                )}
              </CardContent>
            </Card>


            {/* Data + Horários */}
              <Card className="bg-transparent border-slate-700 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2 text-neutral-500" />
                          Data e Horário
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Selecione a Data</Label>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date() || date.getDay() === 0}
                            className="rounded-md border border-neutral-200"
                          />
                        </div>

                        {selectedDate && (
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              Horários Disponíveis
                              {loadingTimeSlots && (
                                <span className="text-sm text-gray-500 ml-2">(Carregando...)</span>
                              )}
                            </Label>
                            
                            {loadingTimeSlots ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-500"></div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 gap-2">
                                {availableTimeSlots.length > 0 ? (
                                  availableTimeSlots.map((time) => (
                                    <Button
                                      key={time}
                                      type="button"
                                      variant={'default'}
                                      size="sm"
                                      onClick={() => setSelectedTime(time)}
                                      className={
                                        selectedTime === time
                                          ? "bg-neutral-500 hover:bg-neutral-600"
                                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                                      }
                                    >
                                      {time}
                                    </Button>
                                  ))
                                ) : (
                                  <div className="col-span-3 text-center py-4 text-gray-500">
                                    Nenhum horário disponível para esta data
                                  </div>
                                )}
                              </div>
                            )}
                            
                          </div>
                        )}
                      </CardContent>
                    </Card>

            <Button
              disabled={!selectedSlot || loading}
              size="lg"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleSubmit(handleConfirm)}
            >
              {loading ? "Agendando..." : "Confirmar agendamento"}
            </Button>
          </CardContent>
        </Card>
        
      </main>
    </div>
  )
}
