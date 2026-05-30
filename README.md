# Aplicativo para transporte escolar

1. Identificação das partes envolvidas e parceiros 
Nome empresarial: Marcelo de Souza Cortinovis
Titulo do estabelecimento: GORDINHO'S TRANSPORTES ESCOLAR, TURISMO E ETC

2. Situação-problema identificada
Muitas pessoas do ramo do transporte escolar possuem dificuldades no acesso
rápido a informações e serviços por meio digital, especialmente em aplicativos
simples e acessíveis para dispositivos Android. Pequenos estabelecimentos e
comunidades, no nosso caso, o transporte escola, frequentemente dependem de
acesso rápido as informações de controle.
Além disso, muitos usuários utilizam apenas smartphones como principal meio de
acesso à internet, tornando essencial o desenvolvimento de aplicações leves,
funcionais e intuitivas.

3. Demanda sociocomunitária e motivação acadêmica
A demanda sociocomunitária identificada está relacionada à necessidade de
modernização e facilitação do acesso à informação através de aplicativos móveis
acessíveis e gratuitos.
desenvolvendo um aplicativo funcional que utiliza conceitos como interface gráfica,
banco de dados local, navegação entre telas e experiência do usuário.

4. Objetivos a serem alcançados em relação à situação-problema
identificada
Objetivo Geral
Desenvolver um aplicativo Android funcional e acessível para auxiliar o usuário no
acesso rápido a informações de qual responsável efetuou pagamento .
Objetivos Específicos
Desenvolver interfaces simples e objetiva
Implementar funcionalidades de cadastro e consulta de informações;
Melhorar a acessibilidade e praticidade para os usuários;

5. Escopo do Projeto<br>
   src/<br>
├── types/index.ts          — Tipagem TypeScript completa<br>
├── data/mockData.ts        — Dados simulados (pronto para integração com API)<br>
├── components/<br>
│   ├── Sidebar.tsx         — Navegação lateral responsiva<br>
│   ├── Dashboard.tsx       — Painel de controle principal<br>
│   ├── StudentsView.tsx    — Lista e filtros de alunos<br>
│   ├── StudentDetail.tsx   — Perfil completo do aluno<br>
│   ├── GuardiansView.tsx   — Cards de responsáveis<br>
│   ├── GuardianDetail.tsx  — Perfil do responsável<br>
│   ├── PaymentsView.tsx    — Gestão de mensalidades<br>
│   ├── AttendanceView.tsx  — Lista de presença interativa<br>
│   ├── ReportsView.tsx     — Relatórios e gráficos de receita<br>
│   └── SettingsView.tsx    — Configurações do sistema<br>
└── App.tsx                 — Roteamento e layout principal<br>


Funcionalidades Implementadas<br>
Módulo - O que faz<br>
Dashboard -	KPIs financeiros, rota do dia, alertas de inadimplência, status de presença<br>
Alunos -	Busca, filtro por turno, foto, escola, série, acesso ao endereço via Maps<br>
Responsáveis -	Cards com contato direto via ligação ou WhatsApp com mensagem pré-formatada<br>
Mensalidades -	Status pago/pendente/atraso, filtro por mês, marcar como pago, cobrar via WhatsApp<br>
Presença -	Marcação em tempo real (Presente/Ausente/Justificado), bulk actions<br>
Relatórios -	Receita mensal, taxa de adimplência, projeção anual, ticket médio<br>
Configurações -	Dados do negócio, valores de mensalidade, segurança, status de sync offline<br>

# RODANDO O PROJETO

1. abrir o projeto no vscode
2. ter no computador os programas instalados node.js / nvm
3. rodar no terminal: npm install
4. npm run dev
5. depois clicar no link localhost e navegar
