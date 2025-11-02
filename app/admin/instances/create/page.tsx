/**
 * Create Instance Page - Wizard Multi-Step Completo
 *
 * Página moderna de criação de instância WhatsApp com wizard intuitivo em 9 steps:
 * 1. Informações Básicas (obrigatório) - Nome + Token
 * 2. Webhook (opcional)
 * 3. RabbitMQ (opcional)
 * 4. S3 Storage (opcional)
 * 5. Filtros & Configurações (opcional)
 * 6. Proxy (opcional)
 * 7. Avançado - WhatsApp Config (opcional)
 * 8. Revisão (confirmar dados)
 * 9. Conexão - QR Code ou Phone Pairing
 *
 * Após conclusão, redireciona automaticamente para /admin/instances/{id}
 */

"use client"

import Link from "next/link"

import { ArrowLeft, Info } from "lucide-react"

import { CreateInstanceWizard } from "@/components/instances"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

/**
 * Create Instance Page - Wizard Multi-Step Completo
 *
 * Página moderna de criação de instância WhatsApp com wizard intuitivo em 9 steps:
 * 1. Informações Básicas (obrigatório) - Nome + Token
 * 2. Webhook (opcional)
 * 3. RabbitMQ (opcional)
 * 4. S3 Storage (opcional)
 * 5. Filtros & Configurações (opcional)
 * 6. Proxy (opcional)
 * 7. Avançado - WhatsApp Config (opcional)
 * 8. Revisão (confirmar dados)
 * 9. Conexão - QR Code ou Phone Pairing
 *
 * Após conclusão, redireciona automaticamente para /admin/instances/{id}
 */

/**
 * Create Instance Page - Wizard Multi-Step Completo
 *
 * Página moderna de criação de instância WhatsApp com wizard intuitivo em 9 steps:
 * 1. Informações Básicas (obrigatório) - Nome + Token
 * 2. Webhook (opcional)
 * 3. RabbitMQ (opcional)
 * 4. S3 Storage (opcional)
 * 5. Filtros & Configurações (opcional)
 * 6. Proxy (opcional)
 * 7. Avançado - WhatsApp Config (opcional)
 * 8. Revisão (confirmar dados)
 * 9. Conexão - QR Code ou Phone Pairing
 *
 * Após conclusão, redireciona automaticamente para /admin/instances/{id}
 */

/**
 * Create Instance Page - Wizard Multi-Step Completo
 *
 * Página moderna de criação de instância WhatsApp com wizard intuitivo em 9 steps:
 * 1. Informações Básicas (obrigatório) - Nome + Token
 * 2. Webhook (opcional)
 * 3. RabbitMQ (opcional)
 * 4. S3 Storage (opcional)
 * 5. Filtros & Configurações (opcional)
 * 6. Proxy (opcional)
 * 7. Avançado - WhatsApp Config (opcional)
 * 8. Revisão (confirmar dados)
 * 9. Conexão - QR Code ou Phone Pairing
 *
 * Após conclusão, redireciona automaticamente para /admin/instances/{id}
 */

/**
 * Create Instance Page - Wizard Multi-Step Completo
 *
 * Página moderna de criação de instância WhatsApp com wizard intuitivo em 9 steps:
 * 1. Informações Básicas (obrigatório) - Nome + Token
 * 2. Webhook (opcional)
 * 3. RabbitMQ (opcional)
 * 4. S3 Storage (opcional)
 * 5. Filtros & Configurações (opcional)
 * 6. Proxy (opcional)
 * 7. Avançado - WhatsApp Config (opcional)
 * 8. Revisão (confirmar dados)
 * 9. Conexão - QR Code ou Phone Pairing
 *
 * Após conclusão, redireciona automaticamente para /admin/instances/{id}
 */

export default function CreateInstancePage() {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/admin/instances">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Instâncias
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Instância WhatsApp</h1>
        <p className="text-muted-foreground mt-1">
          Configure sua nova instância WhatsApp Business seguindo os steps abaixo
        </p>
      </div>

      {/* Important Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Como Funciona</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            Este wizard possui <strong>9 steps</strong>: apenas o primeiro (Nome + Token) é
            obrigatório. Todos os outros são opcionais e podem ser configurados depois.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            <li>
              <strong>Steps 1-7:</strong> Configure nome, token, webhook, RabbitMQ, S3, filtros e
              proxy
            </li>
            <li>
              <strong>Step 8:</strong> Revise todas as configurações antes de criar
            </li>
            <li>
              <strong>Step 9:</strong> Conecte via QR Code ou Phone Pairing (ou conecte depois)
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Wizard Component */}
      <CreateInstanceWizard />

      {/* Help Section */}
      <Alert variant="default" className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 dark:text-blue-100">Precisa de Ajuda?</AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <p className="mb-2">Dicas para configuração:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Use o botão "Gerar Token" para criar um token seguro automaticamente</li>
            <li>Webhook e eventos são essenciais para receber mensagens em tempo real</li>
            <li>S3 é recomendado para armazenar mídias (imagens, vídeos, documentos)</li>
            <li>RabbitMQ é útil para integração com sistemas de fila de mensagens</li>
            <li>Você pode pular steps opcionais e configurá-los depois na página de detalhes</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
