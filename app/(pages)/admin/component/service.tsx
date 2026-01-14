import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

type Service = {
  id: string
  name: string
  price: number
  duration: number
}

export function Service() {
    const [services, setServices] = useState<Service[]>([])
    const [serviceName, setServiceName] = useState("")
      const [price, setPrice] = useState("")
      const [duration, setDuration] = useState("")

    function loadData() {
        fetch("/api/services").then(res => res.json()).then(setServices)
    }

    async function createService() {
        await fetch("/api/services", {
          method: "POST",
          body: JSON.stringify({
            name: serviceName,
            price: Number(price),
            duration: Number(duration),
          }),
        })
    
        setServiceName("")
        setPrice("")
        setDuration("")
        loadData()
      }

      useEffect(() => {
        loadData()
      }, [])
    return(
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Serviços</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Serviços</SheetTitle>
          <SheetDescription>
            Crie serviços para seu clientes. Ex.: Corte, Barba, Corte + Barba, etc
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="space-y-3">
            <Input
            placeholder="Nome"
            value={serviceName}
            onChange={e => setServiceName(e.target.value)}
            />
            <Input
            placeholder="Preço"
            value={price}
            onChange={e => setPrice(e.target.value)}
            />
            <Input
            placeholder="Duração (min)"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            />
            <Button onClick={createService} className="w-full">Adicionar</Button>
          </div>

          {services.map(service => (
            <div
            key={service.id}
            className="flex justify-between border-b py-2"
            >
            <span>{service.name}</span>
            <span>R$ {service.price}</span>
            <span>{service.duration} min</span>
            </div>
          ))}
        </div>
          
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    )
}