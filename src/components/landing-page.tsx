"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Zap, 
  BarChart3, 
  Users, 
  Shield, 
  Webhook,
  CheckCircle,
  Star,
  ChevronRight,
  Menu,
  X,
  Globe
} from "lucide-react";

import { TextAnimate } from "@/components/ui/text-animate";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ThemeToggle, ThemeSwitch } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  locale: string;
}

export function LandingPage({ locale }: LandingPageProps) {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: t("landingPage.features.list.0.title"),
      description: t("landingPage.features.list.0.description"),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: t("landingPage.features.list.1.title"),
      description: t("landingPage.features.list.1.description"),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: t("landingPage.features.list.2.title"),
      description: t("landingPage.features.list.2.description"),
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: t("landingPage.features.list.3.title"),
      description: t("landingPage.features.list.3.description"),
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Webhook,
      title: t("landingPage.features.list.4.title"),
      description: t("landingPage.features.list.4.description"),
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      title: t("landingPage.features.list.5.title"),
      description: t("landingPage.features.list.5.description"),
      color: "from-teal-500 to-blue-500"
    }
  ];

  const stats = [
    {
      number: 50000,
      label: t("landingPage.stats.items.0.label"),
      suffix: t("landingPage.stats.items.0.suffix")
    },
    {
      number: 99.9,
      label: t("landingPage.stats.items.1.label"),
      suffix: t("landingPage.stats.items.1.suffix"),
      decimalPlaces: 1
    },
    {
      number: 500,
      label: t("landingPage.stats.items.2.label"),
      suffix: t("landingPage.stats.items.2.suffix")
    },
    {
      number: 24,
      label: t("landingPage.stats.items.3.label"),
      suffix: t("landingPage.stats.items.3.suffix")
    }
  ];

  const plans = [
    {
      name: t("landingPage.pricing.plans.0.name"),
      price: t("landingPage.pricing.plans.0.price"),
      currency: t("landingPage.pricing.plans.0.currency"),
      period: t("landingPage.pricing.plans.0.period"),
      description: t("landingPage.pricing.plans.0.description"),
      popular: false,
      features: [
        t("landingPage.pricing.plans.0.features.0"),
        t("landingPage.pricing.plans.0.features.1"),
        t("landingPage.pricing.plans.0.features.2"),
        t("landingPage.pricing.plans.0.features.3")
      ]
    },
    {
      name: t("landingPage.pricing.plans.1.name"),
      price: t("landingPage.pricing.plans.1.price"),
      currency: t("landingPage.pricing.plans.1.currency"),
      period: t("landingPage.pricing.plans.1.period"),
      description: t("landingPage.pricing.plans.1.description"),
      popular: true,
      features: [
        t("landingPage.pricing.plans.1.features.0"),
        t("landingPage.pricing.plans.1.features.1"),
        t("landingPage.pricing.plans.1.features.2"),
        t("landingPage.pricing.plans.1.features.3"),
        t("landingPage.pricing.plans.1.features.4"),
        t("landingPage.pricing.plans.1.features.5")
      ]
    },
    {
      name: t("landingPage.pricing.plans.2.name"),
      price: t("landingPage.pricing.plans.2.price"),
      currency: t("landingPage.pricing.plans.2.currency"),
      period: t("landingPage.pricing.plans.2.period"),
      description: t("landingPage.pricing.plans.2.description"),
      popular: false,
      features: [
        t("landingPage.pricing.plans.2.features.0"),
        t("landingPage.pricing.plans.2.features.1"),
        t("landingPage.pricing.plans.2.features.2"),
        t("landingPage.pricing.plans.2.features.3"),
        t("landingPage.pricing.plans.2.features.4"),
        t("landingPage.pricing.plans.2.features.5")
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3"
              >
                <img 
                  src="/logo_logo.png" 
                  alt="ZuckZapGo Logo"
                  className="h-10 w-10"
                />
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("common.appName")}
                </span>
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                {t("landingPage.footer.links.features")}
              </a>
              <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                {t("landingPage.footer.links.pricing")}
              </a>
              
              {/* Theme and Language Controls */}
              <div className="flex items-center space-x-3">
                <ThemeSwitch />
                <LanguageSelector currentLocale={locale} variant="compact" />
              </div>
              
              <div className="flex items-center space-x-3">
                <Link href={`/${locale}/auth/login`}>
                  <Button variant="ghost" size="sm">
                    {t("auth.login.title")}
                  </Button>
                </Link>
                <Link href={`/${locale}/auth/login`}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    {t("landingPage.hero.cta.primary")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-slate-600 dark:text-slate-300">
                  {t("landingPage.footer.links.features")}
                </a>
                <a href="#pricing" className="text-slate-600 dark:text-slate-300">
                  {t("landingPage.footer.links.pricing")}
                </a>
                
                {/* Mobile Theme and Language Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <ThemeToggle variant="icon-only" />
                    <LanguageSelector currentLocale={locale} />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 pt-2">
                  <Link href={`/${locale}/auth/login`}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      {t("auth.login.title")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/auth/login`}>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      {t("landingPage.hero.cta.primary")}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-medium mb-8"
          >
            {t("landingPage.hero.badge")}
          </motion.div>

          <div className="space-y-8">
            <TextAnimate
              animation="blurInUp"
              by="word"
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight"
            >
              {t("landingPage.hero.title")}
            </TextAnimate>

            <TextAnimate
              animation="blurInUp"
              by="word"
              delay={0.2}
              className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent"
            >
              {t("landingPage.hero.subtitle")}
            </TextAnimate>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              {t("landingPage.hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href={`/${locale}/auth/login`}>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold group">
                  {t("landingPage.hero.cta.primary")}
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold">
                {t("landingPage.hero.cta.secondary")}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t("landingPage.stats.title")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-bold text-green-600 mb-2">
                  <NumberTicker
                    value={stat.number}
                    decimalPlaces={stat.decimalPlaces || 0}
                  />
                  {stat.suffix}
                </div>
                <p className="text-slate-600 dark:text-slate-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t("landingPage.features.title")}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {t("landingPage.features.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white dark:bg-slate-900">
                  <CardContent className="p-6">
                    <div className={cn(
                      "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center mb-4",
                      feature.color
                    )}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t("landingPage.howItWorks.title")}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {t("landingPage.howItWorks.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {t(`landingPage.howItWorks.steps.${index}.title`)}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {t(`landingPage.howItWorks.steps.${index}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t("landingPage.pricing.title")}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {t("landingPage.pricing.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "relative",
                  plan.popular && "scale-105"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Popular
                    </span>
                  </div>
                )}
                <Card className={cn(
                  "h-full",
                  plan.popular && "border-green-500 shadow-xl"
                )}>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">
                        {plan.currency}{plan.price}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">{plan.period}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      {plan.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                          <span className="text-slate-600 dark:text-slate-300">{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={cn(
                        "w-full",
                        plan.popular 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                      )}
                    >
                      {t("landingPage.cta.button")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("landingPage.cta.title")}
            </h2>
            <p className="text-xl text-green-100 mb-8">
              {t("landingPage.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={`/${locale}/auth/login`}>
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-slate-100 px-8 py-4 text-lg font-semibold">
                  {t("landingPage.cta.button")}
                </Button>
              </Link>
            </div>
            <p className="text-green-100 text-sm mt-4">
              {t("landingPage.cta.guarantee")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logo_logo.png" 
                  alt="ZuckZapGo Logo"
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold">{t("common.appName")}</span>
              </div>
              <p className="text-slate-400 mb-4">
                {t("landingPage.footer.description")}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t("landingPage.footer.links.product")}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">{t("landingPage.footer.links.features")}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t("landingPage.footer.links.pricing")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("landingPage.footer.links.api")}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t("landingPage.footer.links.company")}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">{t("landingPage.footer.links.about")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("landingPage.footer.links.contact")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("landingPage.footer.links.support")}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t("landingPage.footer.links.legal")}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">{t("landingPage.footer.links.privacy")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("landingPage.footer.links.terms")}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>{t("landingPage.footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 