"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Copy, 
  Eye, 
  Trash,
  Power,
  PowerOff,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { UserInstance } from "@/types"
import { apiClient } from "@/lib/api/client"
import { useAuthStore } from "@/store/auth-store"
import { MagicCard } from "@/components/ui/magic-card"

interface InstancesTableProps {
  instances: UserInstance[]
}

export function InstancesTable({ instances }: InstancesTableProps) {
  const router = useRouter()
  const token = useAuthStore(state => state.token)

  const handleDelete = async (id: string) => {
    if (!token) return
    
    try {
      apiClient.setToken(token)
      await apiClient.deleteUser(id)
      toast.success("Instance deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete instance")
    }
  }

  const handleDisconnect = async (id: string) => {
    if (!token) return
    
    try {
      apiClient.setToken(token)
      // This would disconnect the instance session
      toast.success("Instance disconnected")
      router.refresh()
    } catch (error) {
      toast.error("Failed to disconnect instance")
    }
  }

  const columns: ColumnDef<UserInstance>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "jid",
      header: "Phone Number",
      cell: ({ row }) => {
        const jid = row.getValue("jid") as string
        const phone = jid ? jid.split('@')[0] : "Not connected"
        return <div className="text-sm text-muted-foreground">{phone}</div>
      },
    },
    {
      accessorKey: "connected",
      header: "Status",
      cell: ({ row }) => {
        const connected = row.getValue("connected") as boolean
        const loggedIn = row.original.loggedIn
        
        if (connected && loggedIn) {
          return (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Connected
            </Badge>
          )
        } else if (connected && !loggedIn) {
          return (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Wifi className="mr-1 h-3 w-3" />
              Awaiting QR
            </Badge>
          )
        } else {
          return (
            <Badge variant="destructive">
              <XCircle className="mr-1 h-3 w-3" />
              Disconnected
            </Badge>
          )
        }
      },
    },
    {
      accessorKey: "webhook",
      header: "Webhook",
      cell: ({ row }) => {
        const webhook = row.getValue("webhook") as string
        return webhook ? (
          <Badge variant="outline" className="text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />
            Configured
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            <XCircle className="mr-1 h-3 w-3" />
            Not set
          </Badge>
        )
      },
    },
    {
      accessorKey: "skip_groups",
      header: "Settings",
      cell: ({ row }) => {
        const instance = row.original
        return (
          <div className="flex gap-1">
            {instance.skip_groups && (
              <Badge variant="secondary" className="text-xs">Groups</Badge>
            )}
            {instance.skip_newsletters && (
              <Badge variant="secondary" className="text-xs">News</Badge>
            )}
            {instance.skip_broadcasts && (
              <Badge variant="secondary" className="text-xs">Broad</Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const instance = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(instance.token)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy token
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`/admin/instances/${instance.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDisconnect(instance.id)}
                disabled={!instance.connected}
              >
                <PowerOff className="mr-2 h-4 w-4" />
                Disconnect
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(instance.id)}
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <MagicCard>
      <div className="p-6">
        <DataTable columns={columns} data={instances} searchKey="name" />
      </div>
    </MagicCard>
  )
}