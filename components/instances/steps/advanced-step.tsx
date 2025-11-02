"use client"

/**
 * Step 7: Advanced WhatsApp Configuration
 * Configuração avançada do cliente WhatsApp (versão, plataforma, device spoofing)
 */
import { Info, Settings, Smartphone } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreateInstanceWizardData } from "@/lib/validations"

interface AdvancedStepProps {
  form: UseFormReturn<CreateInstanceWizardData>
}

export function AdvancedStep({ form }: AdvancedStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações Avançadas de WhatsApp
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configurações avançadas de device spoofing e cliente WhatsApp (opcional)
        </p>
      </div>

      <Separator />

      {/* Info sobre configurações opcionais */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Configuração Opcional:</strong> Estas configurações são totalmente opcionais. Os
          valores padrão funcionam perfeitamente para a maioria dos casos. Altere apenas se você
          souber o que está fazendo.
        </AlertDescription>
      </Alert>

      {/* WhatsApp Config em Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {/* Client Information */}
        <AccordionItem value="client-info">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>Client Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WhatsApp Version */}
              <FormField
                control={form.control}
                name="whatsappConfig.waVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Version</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="2.3000.1028708243" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Versão do WhatsApp a emular
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Platform */}
              <FormField
                control={form.control}
                name="whatsappConfig.waPlatform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="WEB (padrão)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WEB">WEB</SelectItem>
                        <SelectItem value="ANDROID">ANDROID</SelectItem>
                        <SelectItem value="IOS">IOS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Plataforma do cliente WhatsApp
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Release Channel */}
              <FormField
                control={form.control}
                name="whatsappConfig.waReleaseChannel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Channel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="RELEASE (padrão)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RELEASE">RELEASE</SelectItem>
                        <SelectItem value="BETA">BETA</SelectItem>
                        <SelectItem value="ALPHA">ALPHA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Canal de release (stable/beta)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Web Sub Platform */}
              <FormField
                control={form.control}
                name="whatsappConfig.waWebSubPlatform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Web Sub Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="WEB_BROWSER (padrão)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WEB_BROWSER">WEB_BROWSER</SelectItem>
                        <SelectItem value="DARWIN">DARWIN</SelectItem>
                        <SelectItem value="LINUX">LINUX</SelectItem>
                        <SelectItem value="WINDOWS">WINDOWS</SelectItem>
                        <SelectItem value="MACOS">MACOS</SelectItem>
                        <SelectItem value="ANDROID">ANDROID</SelectItem>
                        <SelectItem value="IOS">IOS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Sub-plataforma para clientes web
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Device Information */}
        <AccordionItem value="device-info">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>Device Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* OS Name */}
              <FormField
                control={form.control}
                name="whatsappConfig.waOSName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OS Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Mac OS 10 (padrão)" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Nome do sistema operacional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OS Version */}
              <FormField
                control={form.control}
                name="whatsappConfig.waOSVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OS Version</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0.1.0 (padrão whatsmeow)" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Versão do sistema operacional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Device Name */}
              <FormField
                control={form.control}
                name="whatsappConfig.waDeviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Desktop (padrão)" />
                    </FormControl>
                    <FormDescription className="text-xs">Nome do dispositivo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Manufacturer */}
              <FormField
                control={form.control}
                name="whatsappConfig.waManufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Apple (padrão)" />
                    </FormControl>
                    <FormDescription className="text-xs">Fabricante do dispositivo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Device Board */}
              <FormField
                control={form.control}
                name="whatsappConfig.waDeviceBoard"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Device Board</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Mac-123456 (opcional)" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Identificador da placa do dispositivo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Locale & Network */}
        <AccordionItem value="locale-network">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>Locale & Network</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Locale Language */}
              <FormField
                control={form.control}
                name="whatsappConfig.waLocaleLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locale Language</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="en (padrão)" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Código de idioma ISO 639-1 (en, pt, es, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Locale Country */}
              <FormField
                control={form.control}
                name="whatsappConfig.waLocaleCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locale Country</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="US (padrão)" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Código de país ISO 3166-1 (US, BR, AR, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MCC (Mobile Country Code) */}
              <FormField
                control={form.control}
                name="whatsappConfig.waMCC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MCC (Mobile Country Code)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="000 (padrão)" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Código de país da operadora (724 = BR, 310 = US)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MNC (Mobile Network Code) */}
              <FormField
                control={form.control}
                name="whatsappConfig.waMNC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MNC (Mobile Network Code)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="000 (padrão)" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Código da rede da operadora
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Connect Type */}
              <FormField
                control={form.control}
                name="whatsappConfig.waConnectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connect Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="WIFI_UNKNOWN (padrão)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WIFI_UNKNOWN">WIFI_UNKNOWN</SelectItem>
                        <SelectItem value="CELLULAR_LTE">CELLULAR_LTE</SelectItem>
                        <SelectItem value="CELLULAR_3G">CELLULAR_3G</SelectItem>
                        <SelectItem value="CELLULAR_2G">CELLULAR_2G</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">Tipo de conexão de rede</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Platform Type */}
              <FormField
                control={form.control}
                name="whatsappConfig.waPlatformType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="DESKTOP (padrão)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DESKTOP">DESKTOP</SelectItem>
                        <SelectItem value="CHROME">CHROME</SelectItem>
                        <SelectItem value="FIREFOX">FIREFOX</SelectItem>
                        <SelectItem value="SAFARI">SAFARI</SelectItem>
                        <SelectItem value="EDGE">EDGE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Tipo de plataforma para identificação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Info sobre Device Spoofing */}
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <p>
            <strong>Atenção:</strong> Alterar estas configurações pode afetar a estabilidade da
            conexão e até mesmo resultar em bloqueio da conta pelo WhatsApp se valores inválidos
            forem usados.
          </p>
          <p className="mt-2 text-xs">
            Use apenas se você entende completamente o impacto dessas configurações. Os valores
            padrão são seguros e recomendados para produção.
          </p>
        </AlertDescription>
      </Alert>

      {/* Info adicional */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <p>
            <strong>Casos de Uso:</strong>
          </p>
          <ul className="list-disc list-inside text-xs space-y-1">
            <li>
              <strong>Device Spoofing:</strong> Emular diferentes dispositivos e plataformas
            </li>
            <li>
              <strong>Testing:</strong> Testar comportamento em diferentes ambientes
            </li>
            <li>
              <strong>Compliance:</strong> Adaptar para requisitos específicos de região
            </li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
