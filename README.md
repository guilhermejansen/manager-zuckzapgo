# ZuckZapGo Manager 🚀

## 📖 Sobre o Projeto

O **ZuckZapGo Manager** é uma plataforma completa e moderna para gerenciar múltiplas instâncias de WhatsApp Business API. Desenvolvido com as tecnologias mais avançadas do mercado, oferece uma experiência única para automação e gestão de comunicações empresariais.

### ✨ Características Principais

- 🌐 **Interface Multilíngue**: Suporte completo para Português, Inglês e Espanhol
- 🎨 **Design Moderno**: Interface sofisticada construída com componentes Magic UI
- 📱 **100% Responsivo**: Experiência perfeita em desktop, tablet e mobile
- ⚡ **Performance Otimizada**: Carregamento ultra-rápido com animações fluidas
- 🔒 **Segurança Avançada**: Autenticação robusta e proteção de dados
- 🌙 **Modo Escuro**: Suporte completo para tema claro e escuro

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework de estilização utilitária
- **Shadcn/UI** - Componentes de interface modernos
- **Framer Motion** - Animações avançadas e interações
- **Magic UI** - Componentes especiais com efeitos visuais
- **next-intl** - Internacionalização completa
- **Zustand** - Gerenciamento de estado global

### Backend
- **Go** - API robusta e performática
- **WhatsApp Business API** - Integração oficial

## 🎯 Funcionalidades

### 🏠 Landing Page Moderna
- Hero section com animações dinâmicas
- Estatísticas em tempo real com contadores animados
- Seção de recursos com cards interativos
- Preços transparentes e comparação de planos
- Depoimentos de clientes reais
- Call-to-action otimizado para conversão

### 📊 Dashboard Administrativo
- Visão geral completa do sistema
- Métricas em tempo real
- Gestão de múltiplas instâncias
- Monitoramento de saúde do sistema

### 💬 Gestão de Instâncias
- Conexão via QR Code
- Status de conexão em tempo real
- Configurações personalizáveis
- Webhooks avançados

### 🎯 Campanhas Inteligentes
- Criação de campanhas automatizadas
- Segmentação avançada de público
- Templates dinâmicos
- Análise de resultados

### 👥 Gerenciamento de Grupos
- Criação e gestão de grupos
- Controle de participantes
- Moderação automatizada

### 📰 Sistema de Newsletters
- Broadcast para múltiplos contatos
- Segmentação por listas
- Análise de engajamento

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Go 1.19+

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/guilhermejansen/zuckzapgo-private.git
cd zuckzapgo-private
```

2. **Instale as dependências do frontend**
```bash
cd frontend
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

4. **Execute o desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:3000
```

## 🌍 Internacionalização

O projeto suporta múltiplos idiomas:

- 🇧🇷 **Português** (`/pt`)
- 🇺🇸 **Inglês** (`/en`) 
- 🇪🇸 **Espanhol** (`/es`)

### Adicionando Novos Idiomas

1. Crie um novo arquivo em `src/messages/[locale].json`
2. Adicione o locale no arquivo `src/i18n.ts`
3. Configure no `next.config.ts`

## 🎨 Componentes Magic UI

O projeto utiliza componentes avançados do Magic UI:

### Animações de Texto
- **TextAnimate**: Animações de texto palavra por palavra
- **AnimatedGradientText**: Texto com gradiente animado
- **NumberTicker**: Contadores numéricos animados

### Efeitos Visuais
- **BorderBeam**: Bordas com efeito de luz
- **SparklesText**: Texto com efeito de partículas
- **ShimmerButton**: Botões com efeito shimmer

### Exemplo de Uso
```tsx
import { TextAnimate } from "@/components/ui/text-animate";

<TextAnimate 
  animation="blurInUp" 
  by="word"
  className="text-4xl font-bold"
>
  Texto Animado Incrível
</TextAnimate>
```

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/              # Rotas internacionalizadas
│   │   │   ├── auth/              # Autenticação
│   │   │   ├── admin/             # Dashboard administrativo
│   │   │   ├── instance/          # Gestão de instâncias
│   │   │   └── page.tsx           # Landing page
│   │   ├── globals.css            # Estilos globais
│   │   └── layout.tsx             # Layout raiz
│   ├── components/
│   │   ├── ui/                    # Componentes base
│   │   ├── theme-toggle.tsx       # Alternador de tema
│   │   └── landing-page.tsx       # Componente da landing page
│   ├── lib/
│   │   ├── api/                   # Cliente da API
│   │   ├── utils.ts               # Utilitários
│   │   └── validations/           # Validações
│   ├── messages/                  # Arquivos de tradução
│   ├── store/                     # Gerenciamento de estado
│   └── types/                     # Definições de tipos
├── public/                        # Arquivos estáticos
├── next.config.ts                 # Configuração do Next.js
├── tailwind.config.ts             # Configuração do Tailwind
└── package.json                   # Dependências
```

## 🎨 Temas e Customização

### Cores Principais
- **Verde**: `#22C55E` (WhatsApp Green)
- **Azul**: `#0EA5E9` (Primary Blue)
- **Cinza**: `#64748B` (Neutral Gray)

### Modo Escuro
O projeto suporta modo escuro automático baseado na preferência do sistema ou seleção manual.

## 📱 Responsividade

Breakpoints utilizados:
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint

# Formatação
npm run format

# Verificação de tipos
npm run type-check
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npx vercel --prod
```

### Docker
```bash
docker build -t zuckzapgo-frontend .
docker run -p 3000:3000 zuckzapgo-frontend
```

## 📈 Performance

- **Core Web Vitals**: Todas as métricas no verde
- **Lighthouse Score**: 95+ em todas as categorias
- **Bundle Size**: Otimizado com code splitting
- **Images**: Otimização automática com Next.js Image

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Frontend**: Next.js + React
- **Backend**: Go + WhatsApp API
- **Design**: Figma + Tailwind CSS
- **DevOps**: Docker + Vercel

## 📞 Suporte

- 📧 Email: suporte@zuckzapgo.com
- 💬 WhatsApp: +55 11 9999-9999
- 🌐 Website: https://zuckzapgo.com

---

**Desenvolvido com ❤️ para revolucionar a comunicação empresarial via WhatsApp**