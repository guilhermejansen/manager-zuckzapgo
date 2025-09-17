'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Smartphone, Send, CheckCircle2, XCircle, Loader2, Copy, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useInstanceSettingsStore } from '@/store/instance-settings-store';
import { pairPhone } from '@/lib/api/instance';
import { pairPhoneSchema, type PairPhoneData } from '@/lib/validations/instance-settings';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function PhonePairing() {
  const t = useTranslations('instanceSettings.session');
  const tCommon = useTranslations('common');
  
  const { 
    status, 
    linkingCode, 
    setLinkingCode 
  } = useInstanceSettingsStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<PairPhoneData>({
    resolver: zodResolver(pairPhoneSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: PairPhoneData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await pairPhone(data.phone);
      setLinkingCode(result.LinkingCode);
      setSuccess(true);
      toast.success('Código de vinculação gerado com sucesso');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar código de vinculação';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(tCommon('copied'));
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formato brasileiro: +55 (XX) XXXXX-XXXX
    if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    }
    
    // Formato internacional genérico
    return `+${cleaned}`;
  };

  if (status?.connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Instância Conectada
          </CardTitle>
          <CardDescription>
            Pareamento não necessário - instância já conectada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                  Já Conectado
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sua instância está ativa e funcionando
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          {t('phoneCode')}
        </CardTitle>
        <CardDescription>
          Conecte usando seu número de telefone ao invés do QR Code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && linkingCode && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Código de vinculação gerado com sucesso! Use o código abaixo no WhatsApp.
            </AlertDescription>
          </Alert>
        )}

        {/* Phone Number Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">{t('phone')}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder={t('phonePlaceholder')}
                className="pl-10"
                {...register('phone')}
                disabled={loading || status?.connected}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Digite apenas números. Exemplo: 5521999999999 (código do país + DDD + número)
            </p>
          </div>

          <Button 
            type="submit"
            disabled={!isValid || loading || status?.connected}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando código...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Gerar Código de Vinculação
              </>
            )}
          </Button>
        </form>

        {/* Linking Code Display */}
        {linkingCode && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge className="px-2 py-1">
                  {t('linkingCode')}
                </Badge>
              </h4>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
                <div className="text-center space-y-3">
                  <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                    {linkingCode}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(linkingCode)}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {tCommon('copy')}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Instructions */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Como usar o código:
          </h4>
          
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
              <div>
                <strong>Abra o WhatsApp</strong> no celular que será conectado
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
              <div>
                Vá em <strong>Configurações → Dispositivos conectados</strong>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
              <div>
                Toque em <strong>"Conectar um dispositivo"</strong>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
              <div>
                Escolha <strong>"Conectar com número de telefone"</strong>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">5</span>
              <div>
                Digite o <strong>código de vinculação</strong> gerado acima
              </div>
            </li>
          </ol>
        </div>

        {/* Important Notes */}
        <div className="space-y-3">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Dica:</strong> O pareamento por telefone é mais rápido que o QR Code e não requer câmera.
            </AlertDescription>
          </Alert>
          
          <div className="text-xs text-muted-foreground space-y-1 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
            <p><strong>⚠️ Importante:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>O código é válido por alguns minutos apenas</li>
              <li>Use exatamente o número fornecido na geração</li>
              <li>Certifique-se de que o WhatsApp está atualizado</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}