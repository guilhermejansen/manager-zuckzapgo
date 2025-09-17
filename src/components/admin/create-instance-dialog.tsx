"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { apiClient } from "@/lib/api/client"
import { useAuthStore } from "@/store/auth-store"

const createInstanceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  webhook: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  skip_groups: z.boolean(),
  skip_newsletters: z.boolean(),
  skip_broadcasts: z.boolean(),
  skip_own_messages: z.boolean(),
  skip_media_download: z.boolean(),
})

type CreateInstanceFormData = z.infer<typeof createInstanceSchema>

interface CreateInstanceDialogProps {
  children: React.ReactNode
}

export function CreateInstanceDialog({ children }: CreateInstanceDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const token = useAuthStore(state => state.token)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateInstanceFormData>({
    resolver: zodResolver(createInstanceSchema),
    defaultValues: {
      skip_groups: false,
      skip_newsletters: false,
      skip_broadcasts: false,
      skip_own_messages: false,
      skip_media_download: false,
    },
  })

  const onSubmit = async (data: CreateInstanceFormData) => {
    if (!token) return

    setIsLoading(true)
    try {
      apiClient.setToken(token)
      const instance = await apiClient.createUser({
        name: data.name,
        webhook: data.webhook || "",
        skip_groups: data.skip_groups,
        skip_newsletters: data.skip_newsletters,
        skip_broadcasts: data.skip_broadcasts,
        skip_own_messages: data.skip_own_messages,
        skip_media_download: data.skip_media_download,
      })

      toast.success("Instance created successfully")
      setOpen(false)
      reset()
      router.refresh()
    } catch (error) {
      toast.error("Failed to create instance")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Instance</DialogTitle>
            <DialogDescription>
              Create a new WhatsApp instance. The token will be generated automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  placeholder="Marketing Team"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="webhook" className="text-right">
                Webhook URL
              </Label>
              <div className="col-span-3">
                <Input
                  id="webhook"
                  placeholder="https://your-server.com/webhook"
                  {...register("webhook")}
                />
                {errors.webhook && (
                  <p className="text-sm text-destructive mt-1">{errors.webhook.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Message Filters</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="skip_groups" className="text-sm">
                  Skip group messages
                </Label>
                <Switch
                  id="skip_groups"
                  checked={watch("skip_groups")}
                  onCheckedChange={(checked) => setValue("skip_groups", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="skip_newsletters" className="text-sm">
                  Skip newsletter messages
                </Label>
                <Switch
                  id="skip_newsletters"
                  checked={watch("skip_newsletters")}
                  onCheckedChange={(checked) => setValue("skip_newsletters", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="skip_broadcasts" className="text-sm">
                  Skip broadcast messages
                </Label>
                <Switch
                  id="skip_broadcasts"
                  checked={watch("skip_broadcasts")}
                  onCheckedChange={(checked) => setValue("skip_broadcasts", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="skip_own_messages" className="text-sm">
                  Skip own messages
                </Label>
                <Switch
                  id="skip_own_messages"
                  checked={watch("skip_own_messages")}
                  onCheckedChange={(checked) => setValue("skip_own_messages", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="skip_media_download" className="text-sm">
                  Skip media download
                </Label>
                <Switch
                  id="skip_media_download"
                  checked={watch("skip_media_download")}
                  onCheckedChange={(checked) => setValue("skip_media_download", checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Instance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}