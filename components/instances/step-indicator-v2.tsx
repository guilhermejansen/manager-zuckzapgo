/**
 * Step Indicator V2 Component
 *
 * Modern stepper design using shadcn/ui stepper primitives.
 * Navegação visual do wizard com indicadores de steps premium.
 * Mostra o progresso do usuário através dos 9 steps de criação de instância.
 *
 * Based on coss.com stepper design with titles and descriptions.
 */

"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import { cn } from "@/lib/utils"

/**
 * Step Indicator V2 Component
 *
 * Modern stepper design using shadcn/ui stepper primitives.
 * Navegação visual do wizard com indicadores de steps premium.
 * Mostra o progresso do usuário através dos 9 steps de criação de instância.
 *
 * Based on coss.com stepper design with titles and descriptions.
 */

/**
 * Step Indicator V2 Component
 *
 * Modern stepper design using shadcn/ui stepper primitives.
 * Navegação visual do wizard com indicadores de steps premium.
 * Mostra o progresso do usuário através dos 9 steps de criação de instância.
 *
 * Based on coss.com stepper design with titles and descriptions.
 */

/**
 * Step Indicator V2 Component
 *
 * Modern stepper design using shadcn/ui stepper primitives.
 * Navegação visual do wizard com indicadores de steps premium.
 * Mostra o progresso do usuário através dos 9 steps de criação de instância.
 *
 * Based on coss.com stepper design with titles and descriptions.
 */

/**
 * Step interface - mantém compatibilidade com implementação original
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

  const handleStepClick = (step: Step) => {
    if (canNavigateToStep(step) && onStepClick) {
      onStepClick(step.id)
    }
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

      {/* Modern Stepper - Desktop (Horizontal) */}
      <div className="hidden lg:block">
        <Stepper value={currentStep} orientation="horizontal" className="w-full">
          {steps.map((step) => {
            const isCurrent = step.id === currentStep
            const isCompleted = step.completed
            const canClick = canNavigateToStep(step)

            return (
              <StepperItem
                key={step.id}
                step={step.id}
                completed={isCompleted}
                disabled={!canClick}
                className={cn(
                  "relative flex-1 flex-col",
                  !canClick && "cursor-not-allowed opacity-50"
                )}
              >
                <StepperTrigger
                  onClick={() => handleStepClick(step)}
                  disabled={!canClick}
                  className={cn(
                    "flex-col gap-3 rounded transition-all",
                    canClick && !isCurrent && "hover:scale-105 cursor-pointer",
                    isCurrent && "ring-4 ring-primary/20",
                    !canClick && "cursor-not-allowed"
                  )}
                  aria-label={`Step ${step.id}: ${step.name}`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {/* Indicator with number or checkmark */}
                  <StepperIndicator className="h-12 w-12 text-sm font-semibold" />

                  {/* Step info below indicator */}
                  <div className="space-y-0.5 px-2 min-h-[4rem] flex flex-col items-center">
                    <StepperTitle
                      className={cn("whitespace-nowrap", isCurrent && "text-primary font-semibold")}
                    >
                      {step.name}
                    </StepperTitle>
                    <StepperDescription className="text-center text-xs">
                      {step.description}
                    </StepperDescription>

                    {/* Optional badge */}
                    {step.optional && (
                      <Badge variant="outline" className="mt-1 text-[10px] h-4 px-1.5">
                        Opcional
                      </Badge>
                    )}
                  </div>
                </StepperTrigger>

                {/* Connector line between steps */}
                {step.id < steps.length && (
                  <StepperSeparator
                    className={cn(
                      "absolute inset-x-0 top-6 left-[calc(50%+1.5rem+0.125rem)] -order-1 m-0 -translate-y-1/2",
                      "w-[calc(100%-3rem-0.25rem)] flex-none",
                      isCompleted && "bg-primary"
                    )}
                  />
                )}
              </StepperItem>
            )
          })}
        </Stepper>
      </div>

      {/* Modern Stepper - Mobile (Vertical) */}
      <div className="lg:hidden">
        <Stepper value={currentStep} orientation="vertical" className="w-full">
          {steps.map((step) => {
            const isCurrent = step.id === currentStep
            const isCompleted = step.completed
            const canClick = canNavigateToStep(step)

            return (
              <StepperItem
                key={step.id}
                step={step.id}
                completed={isCompleted}
                disabled={!canClick}
                className={cn(
                  "relative flex-row items-start gap-4 pb-6 last:pb-0",
                  !canClick && "cursor-not-allowed opacity-50"
                )}
              >
                {/* Left side: indicator and separator */}
                <div className="flex flex-col items-center">
                  <StepperTrigger
                    onClick={() => handleStepClick(step)}
                    disabled={!canClick}
                    className={cn(
                      "rounded-full transition-all p-0",
                      canClick && !isCurrent && "hover:scale-110 cursor-pointer",
                      isCurrent && "ring-4 ring-primary/20",
                      !canClick && "cursor-not-allowed"
                    )}
                    aria-label={`Step ${step.id}: ${step.name}`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <StepperIndicator className="h-10 w-10 text-sm font-semibold" />
                  </StepperTrigger>

                  {/* Vertical separator */}
                  {step.id < steps.length && (
                    <StepperSeparator
                      className={cn("mt-2 h-12 w-0.5", isCompleted && "bg-primary")}
                    />
                  )}
                </div>

                {/* Right side: step info */}
                <div className="flex-1 pt-1.5 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StepperTitle
                      className={cn("text-sm", isCurrent && "text-primary font-semibold")}
                    >
                      {step.name}
                    </StepperTitle>
                    {step.optional && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                        Opcional
                      </Badge>
                    )}
                  </div>
                  <StepperDescription className="text-xs">{step.description}</StepperDescription>
                </div>
              </StepperItem>
            )
          })}
        </Stepper>
      </div>
    </div>
  )
}
