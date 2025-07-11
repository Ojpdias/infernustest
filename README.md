# 🐉 Infernus - Plataforma RPG Interativa

Uma plataforma web interativa para sessões de RPG (inspirada em D&D 5e) com foco em combate tático e controle narrativo.

![Infernus Logo](public/infernus_logo_3.png)

## 🎯 Características Principais

- **Duas interfaces distintas**: Mestre e Jogador
- **Combate tático** com mapa interativo
- **Controle narrativo** completo para o mestre
- **Comunicação em tempo real** via Socket.IO
- **Tema Dark Fantasy/Infernal/Medieval**

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15.3.5** com TypeScript
- **Tailwind CSS** com paleta personalizada
- **React Konva** para mapa interativo
- **Socket.IO Client** para comunicação em tempo real
- **rpg-dice-roller** para rolagem de dados

### Backend
- **Node.js + Express** integrado ao Next.js
- **Socket.IO Server** para comunicação em tempo real
- **MongoDB Atlas** (configurado via Mongoose)
- **Sistema de autenticação** NextAuth (preparado)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20.18.0+
- pnpm (gerenciador de pacotes)

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd infernus

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas configurações

# Execute em modo de desenvolvimento
pnpm dev
```

### Acesso
- **Página inicial**: http://localhost:3000
- **Interface do Mestre**: http://localhost:3000/master
- **Interface do Jogador**: http://localhost:3000/player

## 🧙‍♂️ Interface do Mestre

### Recursos Disponíveis
- **Escudo do Mestre** (visual 3D simbólico)
- **Controle total do mapa** com grid 20x15
- **Rastreador de iniciativa** completo
- **Gerenciamento de inimigos** e NPCs
- **Rolagens secretas** e públicas
- **Chat privado** com jogadores (whisper)
- **Spawn e movimentação** de tokens
- **Logs secretos** e anotações

### Funcionalidades Testadas ✅
- Controle de iniciativa (Aragorn, Orc Warrior, Legolas)
- Gerenciamento de HP de inimigos
- Sistema de rolagem de dados (1d20, 1d20+5, etc.)
- Mapa interativo com tokens (C para personagem, M para monstro)
- Botões de ação (Spawn Token, Move Token, Open Secret Chat, Save Session)

## 🧑‍🤝‍🧑 Interface do Jogador

### Recursos Disponíveis
- **Mapa central** com visualização limitada
- **4 avatares** nos cantos da tela
- **Escudo do mestre** visível (não interativo)
- **Painel de ações** completo
- **Status do personagem** (HP, MP, condições)
- **Chat público** e logs de combate
- **Rolagens públicas** e privadas

### Funcionalidades Testadas ✅
- Avatares dos jogadores (Aragorn, Legolas, Gimli)
- Ficha do personagem com HP/MP e controles
- Ações de turno (Attack, Cast Spell, Use Item, Move)
- Rolagens rápidas (Attack, Damage, Save, Skill)
- Chat público funcionando
- Logs de combate em tempo real

## 🔧 Arquitetura

### Comunicação em Tempo Real
```javascript
// Eventos principais do Socket.IO
- join-session: Entrar em uma sessão
- send-message: Enviar mensagem no chat
- player-action: Ação do jogador
- roll-dice: Rolagem de dados
- update-initiative: Atualizar iniciativa (mestre)
- move-token: Mover token no mapa (mestre)
```

### Estrutura de Pastas
```
src/
├── app/                 # Páginas Next.js
│   ├── (game)/         # Grupo de rotas do jogo
│   │   ├── master/     # Interface do mestre
│   │   └── player/     # Interface do jogador
│   └── page.tsx        # Página inicial
├── components/         # Componentes React
│   ├── game/          # Componentes do jogo
│   ├── master/        # Componentes do mestre
│   ├── player/        # Componentes do jogador
│   └── ui/            # Componentes de UI
├── hooks/             # Hooks personalizados
├── lib/               # Utilitários e configurações
└── types/             # Tipos TypeScript
```

## 🎨 Design System

### Paleta de Cores
- **Deep Black**: #1A1A1A (fundo principal)
- **Charcoal Gray**: #2C2C2C (elementos secundários)
- **Dark Red**: #8B0000 (acentos e perigo)
- **Aged Gold**: #FFD700 (destaques e sucesso)
- **Silver**: #C0C0C0 (texto secundário)

### Tipografia
- **Fonte principal**: System fonts
- **Estilo gótico**: Para títulos e elementos temáticos
- **Tamanhos**: Responsivos com Tailwind CSS

## 📊 Status do Projeto

### ✅ Funcionalidades Implementadas
- [x] Interface do Mestre completa
- [x] Interface do Jogador completa
- [x] Comunicação Socket.IO
- [x] Sistema de rolagem de dados
- [x] Chat público e logs de combate
- [x] Controle de turnos e iniciativa
- [x] Mapa interativo com tokens
- [x] Página inicial com navegação

### 🔄 Próximas Melhorias
- [ ] Autenticação NextAuth
- [ ] Persistência MongoDB
- [ ] Integração API D&D 5e
- [ ] Deploy no Vercel
- [ ] Fog of War avançado
- [ ] Animações e efeitos visuais

## 🧪 Testes Realizados

Todos os testes de integração foram realizados com sucesso:
- ✅ Navegação entre interfaces
- ✅ Comunicação em tempo real
- ✅ Funcionalidades do mestre
- ✅ Funcionalidades do jogador
- ✅ Sistema de rolagem de dados
- ✅ Chat e logs de combate

Ver [test_results.md](test_results.md) para detalhes completos.

## 🚀 Deploy

### Desenvolvimento
```bash
pnpm dev
```

### Produção
```bash
pnpm build
pnpm start
```

### Vercel (Recomendado)
O projeto está configurado para deploy automático no Vercel com:
- Build otimizado do Next.js
- Servidor Socket.IO integrado
- Variáveis de ambiente configuradas

## 📝 Licença

Este projeto foi desenvolvido como demonstração de uma plataforma RPG interativa.

## 🤝 Contribuição

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para a comunidade RPG**

#   i n f e r n u s t e s t  
 