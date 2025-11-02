"use client"

import { useState } from "react"

import Image from "next/image"
import { useRouter } from "next/navigation"

import { Eye, EyeOff, Shield, User } from "lucide-react"
import { toast } from "sonner"

import { loginAction } from "@/app/actions/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserRole } from "@/types"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<UserRole>("user")
  const [showUserToken, setShowUserToken] = useState(false)
  const [showAdminToken, setShowAdminToken] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const token = formData.get("token") as string

    try {
      const result = await loginAction(token, role)

      if (result.success) {
        toast.success("Login realizado com sucesso!", {
          description: `Bem-vindo ao Manager ZuckZapGo`,
        })

        const redirectPath = result.role === "admin" ? "/admin/dashboard" : "/user/dashboard"

        router.push(redirectPath)
        router.refresh()
      } else {
        toast.error("Erro ao fazer login", {
          description: result.error || "Token inválido ou expirado",
        })
      }
    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Não foi possível fazer login. Tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <div className="relative h-full w-full">
              <Image
                src="/favicon.png"
                alt="Manager ZuckZapGo"
                fill
                priority
                sizes="96px"
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Manager ZuckZapGo</h1>
          <p className="text-muted-foreground">Gerenciamento de Instâncias WhatsApp Business</p>
        </div>

        <Card className="card-elevated border-border/50">
          <CardHeader>
            <CardTitle>Acessar Sistema</CardTitle>
            <CardDescription>Selecione o tipo de acesso e insira seu token</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" onValueChange={(value) => setRole(value as UserRole)}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user" className="gap-2">
                  <User className="w-4 h-4" />
                  Usuário
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-token">Token de Acesso</Label>
                    <div className="relative">
                      <Input
                        id="user-token"
                        name="token"
                        type={showUserToken ? "text" : "password"}
                        placeholder="Digite seu token de usuário"
                        required
                        disabled={loading}
                        className="focus-ring pr-12"
                        autoComplete="on"
                      />
                      <button
                        type="button"
                        onClick={() => setShowUserToken((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showUserToken ? "Ocultar token do usuário" : "Mostrar token do usuário"
                        }
                      >
                        {showUserToken ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Token fornecido pelo administrador do sistema
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Entrando...
                      </>
                    ) : (
                      "Entrar como Usuário"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-token">Token Admin</Label>
                    <div className="relative">
                      <Input
                        id="admin-token"
                        name="token"
                        type={showAdminToken ? "text" : "password"}
                        placeholder="Digite seu token de administrador"
                        required
                        disabled={loading}
                        className="focus-ring pr-12"
                        autoComplete="on"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminToken((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showAdminToken
                            ? "Ocultar token do administrador"
                            : "Mostrar token do administrador"
                        }
                      >
                        {showAdminToken ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Token com permissões administrativas
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading} variant="default">
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Entrando...
                      </>
                    ) : (
                      "Entrar como Admin"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Informações de Segurança */}
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Conexão Segura</p>
                  <p>
                    Seus dados são protegidos com criptografia de ponta a ponta. O token nunca é
                    armazenado em texto puro.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Manager ZuckZapGo © 2025 - Setup Automatizado
        </p>
      </div>
    </div>
  )
}
