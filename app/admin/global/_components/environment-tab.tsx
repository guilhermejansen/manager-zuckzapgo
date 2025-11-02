import { Cloud, Database, Megaphone, Phone, Rabbit, Server, Webhook } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { GlobalConfiguration } from "@/types"

interface EnvironmentTabProps {
  config: GlobalConfiguration
}

export function EnvironmentTab({ config }: EnvironmentTabProps) {
  const { environment_variables } = config

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Variáveis de Ambiente</CardTitle>
          <CardDescription>
            Referência completa das variáveis de ambiente que controlam o comportamento global
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Accordion type="multiple" className="w-full">
            {/* Webhook Settings */}
            <AccordionItem value="webhook">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Webhook className="h-4 w-4" />
                  <span>Global Webhook</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <EnvVarList
                  vars={[
                    {
                      key: "GLOBAL_WEBHOOK_ENABLED",
                      value: environment_variables.GLOBAL_WEBHOOK_ENABLED,
                    },
                    { key: "GLOBAL_WEBHOOK_URL", value: environment_variables.GLOBAL_WEBHOOK_URL },
                    {
                      key: "GLOBAL_WEBHOOK_EVENTS",
                      value: environment_variables.GLOBAL_WEBHOOK_EVENTS,
                    },
                    {
                      key: "GLOBAL_WEBHOOK_CONCURRENCY",
                      value: environment_variables.GLOBAL_WEBHOOK_CONCURRENCY,
                    },
                    {
                      key: "GLOBAL_WEBHOOK_TIMEOUT",
                      value: environment_variables.GLOBAL_WEBHOOK_TIMEOUT,
                    },
                    {
                      key: "GLOBAL_WEBHOOK_RETRY_COUNT",
                      value: environment_variables.GLOBAL_WEBHOOK_RETRY_COUNT,
                    },
                    {
                      key: "GLOBAL_WEBHOOK_RETRY_DELAY",
                      value: environment_variables.GLOBAL_WEBHOOK_RETRY_DELAY,
                    },
                    {
                      key: "GLOBAL_WEBHOOK_MAX_RETRY_DELAY",
                      value: environment_variables.GLOBAL_WEBHOOK_MAX_RETRY_DELAY,
                    },
                    {
                      key: "GLOBAL_WEBHOOK_BACKOFF_FACTOR",
                      value: environment_variables.GLOBAL_WEBHOOK_BACKOFF_FACTOR,
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            {/* RabbitMQ Settings */}
            <AccordionItem value="rabbitmq">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Rabbit className="h-4 w-4" />
                  <span>Global RabbitMQ</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <EnvVarList
                  vars={[
                    {
                      key: "GLOBAL_RABBITMQ_ENABLED",
                      value: environment_variables.GLOBAL_RABBITMQ_ENABLED,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_URL",
                      value: environment_variables.GLOBAL_RABBITMQ_URL,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_EXCHANGE",
                      value: environment_variables.GLOBAL_RABBITMQ_EXCHANGE,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_EXCHANGE_TYPE",
                      value: environment_variables.GLOBAL_RABBITMQ_EXCHANGE_TYPE,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_QUEUE",
                      value: environment_variables.GLOBAL_RABBITMQ_QUEUE,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_QUEUE_TYPE",
                      value: environment_variables.GLOBAL_RABBITMQ_QUEUE_TYPE,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_ROUTING_KEY",
                      value: environment_variables.GLOBAL_RABBITMQ_ROUTING_KEY,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_EVENTS",
                      value: environment_variables.GLOBAL_RABBITMQ_EVENTS,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_DURABLE",
                      value: environment_variables.GLOBAL_RABBITMQ_DURABLE,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_AUTO_DELETE",
                      value: environment_variables.GLOBAL_RABBITMQ_AUTO_DELETE,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_EXCLUSIVE",
                      value: environment_variables.GLOBAL_RABBITMQ_EXCLUSIVE,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_NO_WAIT",
                      value: environment_variables.GLOBAL_RABBITMQ_NO_WAIT,
                    },
                    {
                      key: "GLOBAL_RABBITMQ_DELIVERY_MODE",
                      value: environment_variables.GLOBAL_RABBITMQ_DELIVERY_MODE,
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            {/* S3 Settings */}
            <AccordionItem value="s3">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  <span>Global S3 Storage</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <EnvVarList
                  vars={[
                    { key: "GLOBAL_S3_ENABLED", value: environment_variables.GLOBAL_S3_ENABLED },
                    { key: "GLOBAL_S3_ENDPOINT", value: environment_variables.GLOBAL_S3_ENDPOINT },
                    { key: "GLOBAL_S3_REGION", value: environment_variables.GLOBAL_S3_REGION },
                    { key: "GLOBAL_S3_BUCKET", value: environment_variables.GLOBAL_S3_BUCKET },
                    {
                      key: "GLOBAL_S3_ACCESS_KEY",
                      value: environment_variables.GLOBAL_S3_ACCESS_KEY,
                    },
                    {
                      key: "GLOBAL_S3_SECRET_KEY",
                      value: environment_variables.GLOBAL_S3_SECRET_KEY,
                    },
                    {
                      key: "GLOBAL_S3_PATH_STYLE",
                      value: environment_variables.GLOBAL_S3_PATH_STYLE,
                    },
                    {
                      key: "GLOBAL_S3_DISABLE_ACL",
                      value: environment_variables.GLOBAL_S3_DISABLE_ACL,
                    },
                    {
                      key: "GLOBAL_S3_PUBLIC_URL",
                      value: environment_variables.GLOBAL_S3_PUBLIC_URL,
                    },
                    {
                      key: "GLOBAL_S3_MEDIA_DELIVERY",
                      value: environment_variables.GLOBAL_S3_MEDIA_DELIVERY,
                    },
                    {
                      key: "GLOBAL_S3_RETENTION_DAYS",
                      value: environment_variables.GLOBAL_S3_RETENTION_DAYS,
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Skip Filters */}
            <AccordionItem value="skip">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  <span>Skip Filters</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <EnvVarList
                  vars={[
                    { key: "GLOBAL_SKIP_GROUPS", value: environment_variables.GLOBAL_SKIP_GROUPS },
                    {
                      key: "GLOBAL_SKIP_NEWSLETTERS",
                      value: environment_variables.GLOBAL_SKIP_NEWSLETTERS,
                    },
                    {
                      key: "GLOBAL_SKIP_BROADCASTS",
                      value: environment_variables.GLOBAL_SKIP_BROADCASTS,
                    },
                    {
                      key: "GLOBAL_SKIP_OWN_MESSAGES",
                      value: environment_variables.GLOBAL_SKIP_OWN_MESSAGES,
                    },
                    { key: "GLOBAL_SKIP_CALLS", value: environment_variables.GLOBAL_SKIP_CALLS },
                    {
                      key: "GLOBAL_SKIP_MEDIA_DOWNLOAD",
                      value: environment_variables.GLOBAL_SKIP_MEDIA_DOWNLOAD,
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Call Settings */}
            <AccordionItem value="calls">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Call Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <EnvVarList
                  vars={[
                    {
                      key: "GLOBAL_CALL_REJECT_TYPE",
                      value: environment_variables.GLOBAL_CALL_REJECT_TYPE,
                    },
                    {
                      key: "GLOBAL_CALL_REJECT_MESSAGE",
                      value: environment_variables.GLOBAL_CALL_REJECT_MESSAGE,
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

interface EnvVar {
  key: string
  value: string
}

interface EnvVarListProps {
  vars: EnvVar[]
}

function EnvVarList({ vars }: EnvVarListProps) {
  return (
    <div className="space-y-3 pt-2">
      {vars.map((envVar) => (
        <div key={envVar.key} className="space-y-1 rounded-md border bg-muted/30 p-3">
          <div className="text-xs font-mono font-medium text-muted-foreground break-words">
            {envVar.key}
          </div>
          <div className="text-sm text-foreground break-words leading-relaxed">{envVar.value}</div>
        </div>
      ))}
    </div>
  )
}
