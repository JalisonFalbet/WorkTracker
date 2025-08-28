# WorkTracker - Sistema de Produtividade Inteligente

## 📋 Sobre o Projeto

O WorkTracker é um aplicativo web de produtividade com design minimalista e futurista que ajuda você a gerenciar seu tempo, avaliar seu desempenho e se recompensar por suas conquistas através de um sistema de pontos.

## ✨ Funcionalidades Principais

### 🎯 Sistema Central de Pontos
- **Acumule Pontos**: Ganhe pontos a cada ciclo de trabalho completado
- **Sistema de Recompensas**: Use seus pontos para "comprar" recompensas personalizadas
- **Saldo Visível**: Seus pontos totais são sempre exibidos no cabeçalho

### ⏰ Timer de Foco Inteligente
- **Temporizador Personalizável**: Defina qualquer duração de trabalho
- **Presets Rápidos**: Botões para 15, 25, 45 e 60 minutos
- **Modo Foco Simplificado**: Interface limpa durante o trabalho
- **Cancelamento Inteligente**: Opção de salvar progresso ou descartar ciclo

### 📊 Registro e Avaliação
- **Diário de Ciclos**: Registre título, descrição e avaliação (0-5)
- **Fórmula de Pontos**: `Pontos = (Minutos × Peso do Tempo) + (Nota × Peso do Desempenho)`
- **Configuração Flexível**: Ajuste os pesos da fórmula nas configurações

### 📈 Relatórios Visuais
- **Calendário Colorido**: Visualize sua produtividade em cores (vermelho a verde)
- **Indicador de Metas**: Círculo verde nos dias que atingiu a meta
- **Navegação Mensal**: Veja meses anteriores e futuros
- **Detalhes do Dia**: Clique em qualquer dia para ver todos os ciclos

### 🎁 Loja de Recompensas
- **Recompensas Personalizadas**: Crie prêmios com título, descrição, custo e imagem
- **Gerenciamento Completo**: Edite, arquive ou exclua recompensas
- **Histórico de Resgates**: Veja todas as recompensas já conquistadas
- **Três Seções**: Disponíveis, Arquivadas e Histórico

### ⚙️ Configurações Avançadas
- **Personalização Visual**: Altere a cor de destaque do aplicativo
- **Metas Flexíveis**: Configure meta diária e bônus por meta atingida
- **Fórmula Customizável**: Ajuste pesos do tempo e desempenho
- **Backup Completo**: Export/import de todos os dados

## 🚀 Como Usar

### Primeiro Uso
1. Abra o arquivo `index.html` no seu navegador
2. Configure suas preferências em "Configurações"
3. Defina sua meta diária de pontos
4. Crie suas primeiras recompensas na "Loja"

### Ciclo de Trabalho
1. Na tela "Foco", escolha a duração do timer
2. Clique em "Iniciar Foco"
3. Trabalhe até o timer acabar ou cancele se necessário
4. Registre o ciclo com título, descrição e avaliação
5. Ganhe pontos baseados na fórmula configurada

### Acompanhamento
1. Veja seu progresso diário na barra de meta
2. Consulte o calendário em "Relatórios"
3. Clique nos dias para ver detalhes dos ciclos
4. Use seus pontos para resgatar recompensas

## 💾 Armazenamento de Dados

### Armazenamento Local
- Todos os dados são salvos automaticamente no navegador
- Não há necessidade de conexão com internet após o carregamento
- Os dados persistem entre sessões

### Backup e Restauração
- **Exportar**: Baixe um arquivo JSON com todos os seus dados
- **Importar**: Restaure dados de um backup anterior
- **Formato**: Arquivo JSON legível e editável

## 🎨 Design e Interface

### Características Visuais
- **Tema Escuro**: Design moderno com fundo escuro
- **Cores Personalizáveis**: Altere a cor de destaque
- **Animações Suaves**: Transições e efeitos visuais
- **Responsivo**: Funciona em desktop, tablet e mobile

### Navegação Intuitiva
- **Abas Principais**: Foco, Relatórios, Loja, Configurações
- **Modais Elegantes**: Janelas flutuantes para formulários
- **Feedback Visual**: Indicadores de estado e progresso

## 📱 Compatibilidade

### Navegadores Suportados
- Chrome/Chromium (recomendado)
- Firefox
- Safari
- Edge

### Dispositivos
- **Desktop**: Experiência completa
- **Tablet**: Interface adaptada
- **Mobile**: Layout responsivo

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS
- **JavaScript ES6+**: Lógica da aplicação
- **LocalStorage**: Persistência de dados
- **Font Awesome**: Ícones vetoriais

## 📁 Estrutura de Arquivos

```
worktracker/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md           # Documentação
```

## 🎯 Fórmula de Pontuação

A pontuação é calculada usando a fórmula:

```
Pontos = (Minutos Trabalhados × Peso do Tempo) + (Avaliação × Peso do Desempenho)
```

### Valores Padrão
- **Peso do Tempo**: 2 pontos por minuto
- **Peso do Desempenho**: 20 pontos por ponto de avaliação
- **Bônus de Meta**: 50 pontos extras ao atingir a meta diária

### Exemplo de Cálculo
- Trabalhou 25 minutos com avaliação 4/5
- Pontos = (25 × 2) + (4 × 20) = 50 + 80 = 130 pontos

## 🏆 Sistema de Metas

### Meta Diária
- Configure quantos pontos deseja atingir por dia
- Ganhe bônus extra ao atingir a meta
- Visualize o progresso na barra de progresso

### Indicadores Visuais
- **Barra de Progresso**: Mostra progresso da meta diária
- **Calendário Colorido**: Dias coloridos baseados na performance
- **Círculo Verde**: Indica dias que atingiram a meta

## 🎁 Sistema de Recompensas

### Criação de Recompensas
1. Defina título e descrição
2. Configure o custo em pontos
3. Adicione imagem (opcional)
4. Salve na loja

### Gerenciamento
- **Editar**: Modifique recompensas existentes
- **Arquivar**: Remova temporariamente da loja
- **Excluir**: Remova permanentemente (apenas arquivadas)

### Resgate
- Clique em "Resgatar" se tiver pontos suficientes
- Confirme a ação
- A recompensa vai para o histórico

## 🔄 Backup e Migração

### Exportação
1. Vá em Configurações > Dados
2. Clique em "Exportar Dados"
3. Arquivo será baixado automaticamente

### Importação
1. Vá em Configurações > Dados
2. Clique em "Importar Dados"
3. Selecione o arquivo de backup
4. Confirme a substituição dos dados

## 🎨 Personalização

### Cores
- Altere a cor de destaque nas configurações
- A cor afeta botões, ícones e elementos de destaque
- Mudança é aplicada instantaneamente

### Configurações de Pontuação
- Ajuste o peso do tempo (pontos por minuto)
- Modifique o peso do desempenho (pontos por avaliação)
- Configure meta diária e bônus

## 📞 Suporte

Este é um aplicativo web standalone que funciona completamente offline após o carregamento inicial. Todos os dados são armazenados localmente no seu navegador.

### Dicas de Uso
- Faça backups regulares dos seus dados
- Use o modo foco para máxima concentração
- Configure recompensas motivadoras
- Ajuste a fórmula de pontos conforme sua preferência

---

**WorkTracker** - Transforme sua produtividade em um jogo! 🚀

