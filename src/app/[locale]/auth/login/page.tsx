'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Loader2, Shield, User, ArrowLeft, Eye, EyeOff, Sparkles, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api/client';
import { loginSchema } from '@/lib/validations';
import { TextAnimate } from '@/components/ui/text-animate';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { ThemeSwitch } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/components/ui/language-selector';
import { cn } from '@/lib/utils';

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [locale, setLocale] = useState<string>('pt');

  // Resolve params
  React.useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      type: 'instance',
    },
  });

  const loginType = watch('type');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Set the token in the API client
      apiClient.setToken(data.token);

      if (data.type === 'admin') {
        // Admin login - validate token by trying to fetch users
        const users = await apiClient.getUsers();
        login(data.token, 'admin');
        toast.success(t('loginSuccess'));
        router.push(`/${locale}/admin/dashboard`);
      } else {
        // Instance login - validate token by checking session status
        const status = await apiClient.getSessionStatus();
        login(data.token, 'instance');
        toast.success(t('loginSuccess'));
        router.push(`/${locale}/instance/dashboard`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('invalidToken'));
      apiClient.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-400/10 to-cyan-400/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 0.8 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-300/5 to-cyan-300/5 rounded-full blur-2xl"
        />
      </div>

      {/* Header with Logo and Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 z-20 bg-white/5 dark:bg-slate-900/5 backdrop-blur-sm border-b border-white/10 dark:border-slate-700/30"
      >
        <div className="flex justify-between items-center p-4 md:p-6">
          <Link href={`/${locale}`} className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              <motion.img 
                src="/logo_logo.png" 
                alt="ZuckZapGo Logo"
                className="h-8 w-8 md:h-10 md:w-10 group-hover:drop-shadow-lg transition-all duration-300"
                whileHover={{ rotate: 5 }}
              />
              <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {t('appName')}
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeSwitch />
            <LanguageSelector currentLocale={locale} variant="compact" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-lg"
        >
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-cyan-500/5 pointer-events-none" />
            <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
            
            <CardHeader className="space-y-6 pb-6 pt-8 px-6 md:px-8">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.4 }}
                  className="mb-6"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl shadow-2xl animate-pulse" />
                    <div className="absolute inset-0.5 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center">
                      <motion.img 
                        src="/logo_logo.png" 
                        alt="ZuckZapGo Logo"
                        className="h-12 w-12"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      />
                    </div>
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-2xl blur-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
                
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3"
                >
                  {t('title')}
                </TextAnimate>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <AnimatedGradientText className="text-base md:text-lg font-semibold">
                    {t('subtitle')}
                  </AnimatedGradientText>
                </motion.div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 px-6 md:px-8 pb-8">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Login Type Selection */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-green-500" />
                      {t('loginTypeLabel')}
                    </Label>
                  </motion.div>
                  <RadioGroup
                    value={loginType}
                    onValueChange={(value) => setValue('type', value as 'admin' | 'instance')}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden",
                        loginType === 'admin' 
                          ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 shadow-lg shadow-green-500/20" 
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg hover:shadow-green-500/10"
                      )}
                    >
                      {loginType === 'admin' && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <RadioGroupItem value="admin" id="admin" className="z-10" />
                      <div className="flex flex-col items-center text-center flex-1 z-10">
                        <motion.div
                          className={cn(
                            "p-2 rounded-lg mb-2 transition-all duration-300",
                            loginType === 'admin' 
                              ? "bg-green-500 text-white shadow-lg" 
                              : "bg-green-100 dark:bg-green-900/30 text-green-600 group-hover:bg-green-200 dark:group-hover:bg-green-800/40"
                          )}
                          whileHover={{ rotate: 5 }}
                        >
                          <Shield className="h-5 w-5" />
                        </motion.div>
                        <Label htmlFor="admin" className="cursor-pointer text-sm font-semibold">
                          {t('adminAccess')}
                        </Label>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden",
                        loginType === 'instance' 
                          ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 shadow-lg shadow-green-500/20" 
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg hover:shadow-green-500/10"
                      )}
                    >
                      {loginType === 'instance' && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <RadioGroupItem value="instance" id="instance" className="z-10" />
                      <div className="flex flex-col items-center text-center flex-1 z-10">
                        <motion.div
                          className={cn(
                            "p-2 rounded-lg mb-2 transition-all duration-300",
                            loginType === 'instance' 
                              ? "bg-blue-500 text-white shadow-lg" 
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40"
                          )}
                          whileHover={{ rotate: -5 }}
                        >
                          <User className="h-5 w-5" />
                        </motion.div>
                        <Label htmlFor="instance" className="cursor-pointer text-sm font-semibold">
                          {t('instanceAccess')}
                        </Label>
                      </div>
                    </motion.div>
                  </RadioGroup>
                </div>

                {/* Token Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="space-y-3"
                >
                  <Label htmlFor="token" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    {t('tokenLabel')}
                  </Label>
                  <div className="relative group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.02 }}
                    />
                    <Input
                      id="token"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('tokenPlaceholder')}
                      {...register('token')}
                      disabled={isLoading}
                      className="relative pr-12 h-14 text-base rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 backdrop-blur-sm focus:border-green-500 focus:ring-green-500/20 transition-all duration-300"
                    />
                    <motion.button
                      type="button"
                      className="absolute right-0 top-0 h-14 px-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence mode="wait">
                        {showPassword ? (
                          <motion.div
                            key="eye-off"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <EyeOff className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="eye"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Eye className="h-5 w-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {errors.token && (
                      <motion.p
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                      >
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.token.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-cyan-600 rounded-xl blur opacity-50"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Button
                    type="submit"
                    className="relative w-full h-14 text-base font-semibold bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white shadow-xl rounded-xl border-0 overflow-hidden group"
                    disabled={isLoading}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-400/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="relative flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center"
                          >
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t('loading')}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="login"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center"
                          >
                            {t('loginButton')}
                            <motion.div
                              className="ml-2"
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Sparkles className="h-5 w-5" />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Button>
                </motion.div>
              </motion.form>

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="text-center pt-4 border-t border-slate-200/50 dark:border-slate-700/50"
              >
                <motion.p 
                  className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    💬
                  </motion.span>
                  {t('helpText') || 'Precisa de ajuda? Entre em contato com o suporte.'}
                </motion.p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}