"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Copy, ServerCrash, ShieldCheck, ShieldOff } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { MonitoringClientInfo } from "@/types"

interface ClientsTableProps {
  clients: MonitoringClientInfo[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const copyToClipboard = (value: string, successMessage: string) => () => {
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success(successMessage))
      .catch(() => toast.error("Não foi possível copiar o valor"))
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" /> Clientes SSE conectados
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Monitoramento dos consumidores ativos com informações de filtro e heartbeat.
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {clients.length} conexões ativas
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[50vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">Client ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Conectado em</TableHead>
                <TableHead>Último heartbeat</TableHead>
                <TableHead>Filtro</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Nenhum cliente conectado no momento.
                  </TableCell>
                </TableRow>
              )}
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="truncate max-w-[140px]">
                            {client.id}
                          </TooltipTrigger>
                          <TooltipContent>{client.id}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={copyToClipboard(client.session_token, "Token copiado")}
                        title="Copiar session token"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{client.user_id || "—"}</TableCell>
                  <TableCell>
                    {client.is_admin ? (
                      <Badge variant="secondary" className="gap-1">
                        <ShieldCheck className="h-3 w-3" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <ShieldOff className="h-3 w-3" /> User
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {formatDistanceToNow(new Date(client.connected_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </TooltipTrigger>
                        <TooltipContent>
                          {new Date(client.connected_at).toLocaleString("pt-BR")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {formatDistanceToNow(new Date(client.last_heartbeat), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </TooltipTrigger>
                        <TooltipContent>
                          {new Date(client.last_heartbeat).toLocaleString("pt-BR")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {client.filter ? (
                      <div className="flex flex-wrap gap-1">
                        {client.filter.user_id && (
                          <Badge variant="outline" className="font-mono text-[10px]">
                            user:{client.filter.user_id}
                          </Badge>
                        )}
                        {client.filter.event_type && (
                          <Badge variant="outline" className="font-mono text-[10px]">
                            type:{client.filter.event_type}
                          </Badge>
                        )}
                        {client.filter.status && (
                          <Badge variant="outline" className="font-mono text-[10px]">
                            status:{client.filter.status}
                          </Badge>
                        )}
                        {client.filter.only_failed && (
                          <Badge variant="destructive" className="text-[10px]">
                            only_failed
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Todos os eventos</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <ServerCrash className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>Último evento #{client.last_event_id}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
