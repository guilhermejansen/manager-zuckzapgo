/**
 * Step Indicator Component
 *
 * Navegação visual do wizard com progress bar e indicadores de steps.
 * Mostra o progresso do usuário através dos 9 steps de criação de instância.
 */

"use client"

import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/**
 * Step Indicator Component
 *
 * Navegação visual do wizard com progress bar e indicadores de steps.
 * Mostra o progresso do usuário através dos 9 steps de criação de instância.
 */

/**
 * Step Indicator Component
 *
 * Navegação visual do wizard com progress bar e indicadores de steps.
 * Mostra o progresso do usuário através dos 9 steps de criação de instância.
 */

/**
 * Step Indicator Component
 *
 * Navegação visual do wizard com progress bar e indicadores de steps.
 * Mostra o progresso do usuário através dos 9 steps de criação de instância.
 */

/**
 * Step Indicator Component
 *
 * Navegação visual do wizard com progress bar e indicadores de steps.
 * Mostra o progresso do usuário através dos 9 steps de criação de instância.
 */

export interface Step {
  id: number
  name: string
  description: string
  optional?: boolean
  completed?: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepId: number) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  const completedSteps = steps.filter((s) => s.completed).length
  const progressPercentage = Math.round((completedSteps / steps.length) * 100)

  const canNavigateToStep = (step: Step) => {
    // Pode navegar para steps já completados ou o step atual
    return step.completed || step.id === currentStep
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Progresso: {completedSteps} de {steps.length} steps
          </span>
          <span className="text-muted-foreground">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Separator />

      {/* Steps List - Desktop */}
      <div className="hidden lg:block space-y-4">
        {/* Step Circles with Lines */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCurrent = step.id === currentStep
            const isCompleted = step.completed
            const isPending = !isCurrent && !isCompleted
            const canClick = canNavigateToStep(step)

            return (
              <div key={step.id} className="flex flex-1 items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => canClick && onStepClick?.(step.id)}
                    disabled={!canClick}
                    className={cn(
                      "group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                      isCurrent &&
                        "border-primary bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20",
                      isCompleted && "border-green-600 bg-green-600 text-white hover:bg-green-700",
                      isPending && "border-muted bg-muted text-muted-foreground",
                      canClick && !isCurrent && "cursor-pointer hover:scale-110",
                      !canClick && "cursor-not-allowed opacity-50"
                    )}
                    aria-label={`Step ${step.id}: ${step.name}`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </button>

                  {/* Step Name Below Circle */}
                  <div className="mt-3 text-center min-h-[3rem]">
                    <p
                      className={cn(
                        "text-xs font-medium whitespace-nowrap",
                        isCurrent && "text-primary font-semibold"
                      )}
                    >
                      {step.name}
                    </p>
                    {step.optional && (
                      <Badge variant="outline" className="mt-1 text-[10px] h-4 px-1.5">
                        Opcional
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-full mx-2 transition-all -mt-8",
                      isCompleted ? "bg-green-600" : "bg-muted"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Steps List - Mobile (Vertical) */}
      <div className="lg:hidden space-y-4">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep
          const isCompleted = step.completed
          const isPending = !isCurrent && !isCompleted
          const canClick = canNavigateToStep(step)

          return (
            <div key={step.id} className="flex items-start gap-4">
              {/* Step Circle & Line */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => canClick && onStepClick?.(step.id)}
                  disabled={!canClick}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20",
                    isCompleted && "border-green-600 bg-green-600 text-white",
                    isPending && "border-muted bg-muted text-muted-foreground",
                    canClick && !isCurrent && "cursor-pointer",
                    !canClick && "cursor-not-allowed opacity-50"
                  )}
                  aria-label={`Step ${step.id}: ${step.name}`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </button>

                {/* Vertical Connector */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "my-2 w-0.5 h-8 transition-all",
                      isCompleted ? "bg-green-600" : "bg-muted"
                    )}
                  />
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 pt-1.5">
                <div className="flex items-center gap-2">
                  <h4
                    className={cn("text-sm font-medium", isCurrent && "text-primary font-semibold")}
                  >
                    {step.name}
                  </h4>
                  {step.optional && (
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                      Opcional
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
