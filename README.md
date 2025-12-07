🚀 TaskFlow – Gerenciador de Tarefas Acessível

Uma ferramenta simples, rápida e sempre sincronizada para organizar seu dia com foco e clareza.

🎯 Visão Geral da Arquitetura

O TaskFlow é uma aplicação full-stack construída com Next.js 16, utilizando:

Firebase Firestore como banco de dados

Firebase Authentication para login

Tailwind CSS para estilização

@dnd-kit para drag-and-drop

FullCalendar para visão de calendário

Recursos de acessibilidade digital: VLibras, tema alto contraste e fonte ampliada

Deploy automático via Vercel

A arquitetura segue o App Router do Next.js, combinando:

Server Components → páginas estáticas (landing, dashboard)

Client Components → interatividade (Kanban, formulários, temas)

O acesso a dados é feito diretamente no frontend usando Firebase Client SDK, garantindo segurança via Firestore Rules.

🗂️ Estrutura de Pastas
src/
├── app/
│   ├── calendar/              # Página do calendário
│   ├── dashboard/             # Página principal
│   ├── kanban/                # Quadro Kanban
│   ├── login/ , register/     # Autenticação
│   ├── tasks/[taskId]/        # Página de detalhes da tarefa
│   ├── layout.tsx             # Layout raiz (Client Component)
│   ├── metadata.ts            # Metadados do site
│   └── page.tsx               # Página inicial
│
├── components/
│   ├── calendar/              # TaskModal.tsx
│   ├── kanban/                # KanbanBoard, Column, Card
│   ├── landing/               # HeroSection.tsx
│   ├── layout/                # Header.tsx
│   ├── tasks/                 # Formulários, sub-tarefas, comentários
│   └── VLibrasWrapper.tsx     # Integração com VLibras
│
├── contexts/
│   └── A11yContext.tsx        # Temas de acessibilidade
│
├── lib/
│   ├── firebase.ts            # Inicialização Firebase
│   └── firestore.ts           # CRUD (getTask, updateTask, etc.)
│
├── types/
│   └── index.ts               # Tipagens TypeScript
│
└── globals.css                # Estilos globais

🧩 Modelagem de Dados (TypeScript)
// src/types/index.ts

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  subtasks: Subtask[];
}

🛠️ Como Rodar Localmente
git clone https://github.com/PedroBudke/TaskFlow.git
cd taskflow
npm install

1. Configure o Firebase

Crie um projeto no Firebase Console

Ative:

Authentication – Email/Password

Firestore Database

Copie as credenciais do app Web

2. Crie o arquivo .env.local:
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

3. Execute o servidor:
npm run dev

🌐 Aplicação Publicada

🔗 Live Demo:
https://task-flow-pedrobudkes-projects.vercel.app/

⚠️ Desafios Técnicos e Soluções
1. Gerenciamento de estado no drag-and-drop

Problema: tarefas sumiam quando soltas fora das colunas.
Solução: validação no handleDragEnd garantindo uma coluna de destino válida.

2. Performance do calendário com muitos eventos

Problema: FullCalendar perde desempenho com centenas de tarefas.
Solução:

Carregar apenas eventos do mês visível

Usar React.memo e useCallback para evitar re-renders

3. Temas de acessibilidade

Problema: tema "Fonte Ampliada" aplicava fundo preto indevido.
Solução: definir estilos explícitos e isolados para cada tema no globals.css.
