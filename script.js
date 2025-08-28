// WorkTracker - Sistema de Produtividade
class WorkTracker {
    constructor() {
        this.data = this.loadData();
        this.timer = {
            isRunning: false,
            startTime: null,
            duration: 25 * 60, // 25 minutos em segundos
            interval: null,
            workTime: 0
        };
        this.currentView = 'timer';
        this.currentMonth = new Date();
        
        this.init();
    }

    // Inicialização
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.applySettings();
        this.showView('timer');
    }

    // Gerenciamento de dados
    loadData() {
        const defaultData = {
            settings: {
                accentColor: '#00d4ff',
                secondaryColor: '#0099cc',
                dailyGoal: 1000,
                goalBonus: 50,
                timeWeight: 2,
                performanceWeight: 20
            },
            cycles: [],
            rewards: [],
            archivedRewards: [],
            rewardHistory: [],
            totalPoints: 0
        };

        try {
            const saved = localStorage.getItem('worktracker-data');
            return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return defaultData;
        }
    }

    saveData() {
        try {
            localStorage.setItem('worktracker-data', JSON.stringify(this.data));
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro ao salvar dados. Verifique o espaço de armazenamento.');
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.showView(view);
            });
        });

        // Timer
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.currentTarget.dataset.minutes);
                this.setTimerDuration(minutes);
            });
        });

        document.getElementById('setCustomTime').addEventListener('click', () => {
            const minutes = parseInt(document.getElementById('customMinutes').value);
            if (minutes && minutes > 0 && minutes <= 180) {
                this.setTimerDuration(minutes);
                document.getElementById('customMinutes').value = '';
            }
        });

        document.getElementById('startTimer').addEventListener('click', () => {
            this.startTimer();
        });

        document.getElementById('cancelTimer').addEventListener('click', () => {
            this.showCancelModal();
        });

        // Modals
        document.getElementById('saveProgress').addEventListener('click', () => {
            this.stopTimer(true);
        });

        document.getElementById('discardCycle').addEventListener('click', () => {
            this.stopTimer(false);
        });

        document.getElementById('cancelCycle').addEventListener('click', () => {
            this.closeModal('cycleModal');
        });

        document.getElementById('cycleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCycle();
        });

        // Rating slider
        document.getElementById('cycleRating').addEventListener('input', (e) => {
            document.getElementById('ratingValue').textContent = e.target.value;
        });

        // Relatórios
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.updateReports();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.updateReports();
        });

        // Loja
        document.getElementById('addReward').addEventListener('click', () => {
            this.showRewardModal();
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.showStoreTab(tab);
            });
        });

        document.getElementById('cancelReward').addEventListener('click', () => {
            this.closeModal('rewardModal');
        });

        document.getElementById('rewardForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveReward();
        });

        // Configurações
        document.getElementById("accentColor").addEventListener("change", (e) => {
            this.updateAccentColor(e.target.value);
        });

        document.getElementById("secondaryColor").addEventListener("change", (e) => {
            this.updateSecondaryColor(e.target.value);
        });

        document.getElementById('dailyGoalSetting').addEventListener('change', (e) => {
            this.data.settings.dailyGoal = parseInt(e.target.value);
            this.saveData();
            this.updateDisplay();
        });

        document.getElementById('goalBonus').addEventListener('change', (e) => {
            this.data.settings.goalBonus = parseInt(e.target.value);
            this.saveData();
        });

        document.getElementById('timeWeight').addEventListener('change', (e) => {
            this.data.settings.timeWeight = parseFloat(e.target.value);
            this.saveData();
        });

        document.getElementById('performanceWeight').addEventListener('change', (e) => {
            this.data.settings.performanceWeight = parseInt(e.target.value);
            this.saveData();
        });

        // Export/Import
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importData').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Modal close
        document.getElementById('closeDayModal').addEventListener('click', () => {
            this.closeModal('dayModal');
        });

        // Click fora do modal para fechar
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // Navegação
    showView(viewName) {
        // Atualizar navegação
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Mostrar view
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');

        this.currentView = viewName;

        // Atualizar conteúdo específico da view
        if (viewName === 'reports') {
            this.updateReports();
        } else if (viewName === 'store') {
            this.updateStore();
        } else if (viewName === 'settings') {
            this.updateSettings();
        }
    }

    // Timer
    setTimerDuration(minutes) {
        if (this.timer.isRunning) return;

        this.timer.duration = minutes * 60;
        this.updateTimerDisplay();

        // Atualizar botões preset
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.minutes) === minutes) {
                btn.classList.add('active');
            }
        });
    }

    startTimer() {
        this.timer.isRunning = true;
        this.timer.startTime = Date.now();
        this.timer.workTime = 0;

        // Mostrar controles de timer ativo
        document.getElementById('timerControls').style.display = 'none';
        document.getElementById('timerActive').style.display = 'block';

        // Adicionar classe ativa ao círculo
        document.querySelector('.timer-circle').classList.add('active');

        // Iniciar contagem regressiva
        this.timer.interval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        if (!this.timer.isRunning) return;

        const elapsed = Math.floor((Date.now() - this.timer.startTime) / 1000);
        this.timer.workTime = elapsed;
        const remaining = Math.max(0, this.timer.duration - elapsed);

        this.updateTimerDisplay(remaining);

        if (remaining === 0) {
            this.stopTimer(true);
        }
    }

    updateTimerDisplay(seconds = null) {
        const timeToShow = seconds !== null ? seconds : this.timer.duration;
        const minutes = Math.floor(timeToShow / 60);
        const secs = timeToShow % 60;

        document.getElementById('timerMinutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('timerSeconds').textContent = secs.toString().padStart(2, '0');
    }

    stopTimer(save = false) {
        this.timer.isRunning = false;
        clearInterval(this.timer.interval);

        // Remover classe ativa do círculo
        document.querySelector('.timer-circle').classList.remove('active');

        // Mostrar controles normais
        document.getElementById('timerControls').style.display = 'block';
        document.getElementById('timerActive').style.display = 'none';

        // Fechar modal de cancelamento se estiver aberto
        this.closeModal('cancelModal');

        if (save && this.timer.workTime > 0) {
            this.showCycleModal();
        } else {
            this.resetTimer();
        }
    }

    resetTimer() {
        this.timer.workTime = 0;
        this.updateTimerDisplay();
    }

    showCancelModal() {
        this.showModal('cancelModal');
    }

    showCycleModal() {
        // Limpar formulário
        document.getElementById('cycleTitle').value = '';
        document.getElementById('cycleDescription').value = '';
        document.getElementById('cycleRating').value = '3';
        document.getElementById('ratingValue').textContent = '3';

        this.showModal('cycleModal');
    }

    saveCycle() {
        const title = document.getElementById('cycleTitle').value;
        const description = document.getElementById('cycleDescription').value;
        const rating = parseInt(document.getElementById('cycleRating').value);
        const workMinutes = Math.floor(this.timer.workTime / 60);

        // Calcular pontos
        const points = Math.round(
            (workMinutes * this.data.settings.timeWeight) + 
            (rating * this.data.settings.performanceWeight)
        );

        // Criar ciclo
        const cycle = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            title,
            description,
            rating,
            workMinutes,
            points,
            timestamp: new Date().toISOString()
        };

        // Salvar ciclo
        this.data.cycles.push(cycle);
        this.data.totalPoints += points;

        // Verificar se atingiu meta diária
        const todayPoints = this.getTodayPoints();
        if (todayPoints >= this.data.settings.dailyGoal) {
            // Verificar se já ganhou bônus hoje
            const today = new Date().toISOString().split('T')[0];
            const todayCycles = this.data.cycles.filter(c => c.date === today);
            const bonusAlreadyGiven = todayCycles.some(c => c.goalBonus);

            if (!bonusAlreadyGiven) {
                cycle.goalBonus = this.data.settings.goalBonus;
                this.data.totalPoints += this.data.settings.goalBonus;
                
                // Mostrar notificação de meta atingida
                this.showGoalAchievedNotification();
            }
        }

        this.saveData();
        this.updateDisplay();
        this.closeModal('cycleModal');
        this.resetTimer();
    }

    showGoalAchievedNotification() {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.className = 'goal-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-trophy"></i>
                <h4>Meta Diária Atingida!</h4>
                <p>Você ganhou ${this.data.settings.goalBonus} pontos bônus!</p>
            </div>
        `;
        
        // Adicionar estilos
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--success-color), #00cc66);
            color: white;
            padding: 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 2000;
            text-align: center;
            animation: goalPop 0.5s ease;
        `;

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Relatórios
    updateReports() {
        this.updateMonthNavigation();
        this.updateMonthSummary();
        this.updateCalendar();
    }

    updateMonthNavigation() {
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        const monthText = `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
        document.getElementById('currentMonth').textContent = monthText;
    }

    updateMonthSummary() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();

        const monthCycles = this.data.cycles.filter(cycle => {
            const cycleDate = new Date(cycle.date);
            return cycleDate.getFullYear() === year && cycleDate.getMonth() === month;
        });

        // Calcular média do mês
        const dailyTotals = {};
        monthCycles.forEach(cycle => {
            if (!dailyTotals[cycle.date]) {
                dailyTotals[cycle.date] = 0;
            }
            dailyTotals[cycle.date] += cycle.points + (cycle.goalBonus || 0);
        });

        const days = Object.keys(dailyTotals);
        const average = days.length > 0 ? 
            Math.round(Object.values(dailyTotals).reduce((a, b) => a + b, 0) / days.length) : 0;

        // Contar metas atingidas
        const goalsAchieved = days.filter(date => dailyTotals[date] >= this.data.settings.dailyGoal).length;

        document.getElementById('monthAverage').textContent = average;
        document.getElementById('goalsAchieved').textContent = goalsAchieved;
    }

    updateCalendar() {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        // Cabeçalho dos dias da semana
        const header = document.createElement('div');
        header.className = 'calendar-header';
        
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            header.appendChild(dayHeader);
        });
        calendar.appendChild(header);

        // Grid do calendário
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const today = new Date();

        // Dias do mês anterior para completar a primeira semana
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Gerar 42 dias (6 semanas)
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();

            const dateString = currentDate.toISOString().split('T')[0];
            const dayPoints = this.getDayPoints(dateString);

            // Classificar o dia
            if (currentDate.getMonth() !== month) {
                dayElement.classList.add('other-month');
            } else if (currentDate > today) {
                dayElement.classList.add('future');
            } else if (dayPoints > 0) {
                dayElement.classList.add('has-data');
                
                // Colorir baseado na performance
                const performance = dayPoints / this.data.settings.dailyGoal;
                const hue = Math.min(120, performance * 120); // 0 (vermelho) a 120 (verde)
                const saturation = Math.min(100, 50 + performance * 50);
                const lightness = Math.min(60, 30 + performance * 30);
                
                dayElement.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                dayElement.style.color = lightness > 40 ? '#000' : '#fff';

                // Adicionar indicador de meta atingida
                if (dayPoints >= this.data.settings.dailyGoal) {
                    dayElement.classList.add('goal-achieved');
                }

                // Adicionar evento de clique
                dayElement.addEventListener('click', () => {
                    this.showDayDetails(dateString);
                });
            }

            grid.appendChild(dayElement);
        }

        calendar.appendChild(grid);
    }

    getDayPoints(date) {
        return this.data.cycles
            .filter(cycle => cycle.date === date)
            .reduce((total, cycle) => total + cycle.points + (cycle.goalBonus || 0), 0);
    }

    getTodayPoints() {
        const today = new Date().toISOString().split('T')[0];
        return this.getDayPoints(today);
    }

    showDayDetails(date) {
        const dayCycles = this.data.cycles.filter(cycle => cycle.date === date);
        
        if (dayCycles.length === 0) return;

        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('pt-BR');
        
        document.getElementById('dayModalTitle').textContent = `Detalhes de ${formattedDate}`;
        
        const content = document.getElementById('dayModalContent');
        content.innerHTML = '';

        dayCycles.forEach(cycle => {
            const cycleElement = document.createElement('div');
            cycleElement.className = 'day-cycle';
            cycleElement.innerHTML = `
                <div class="cycle-header">
                    <h4>${cycle.title}</h4>
                    <span class="cycle-points">${cycle.points}${cycle.goalBonus ? ` (+${cycle.goalBonus})` : ''} pts</span>
                </div>
                <p class="cycle-description">${cycle.description || 'Sem descrição'}</p>
                <div class="cycle-meta">
                    <span>⏱️ ${cycle.workMinutes} min</span>
                    <span>⭐ ${cycle.rating}/5</span>
                    <span>🕐 ${new Date(cycle.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            `;
            content.appendChild(cycleElement);
        });

        // Adicionar estilos para os detalhes do dia
        const style = document.createElement('style');
        style.textContent = `
            .day-cycle {
                background: var(--bg-tertiary);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                border: 1px solid var(--border-color);
            }
            .cycle-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            .cycle-header h4 {
                color: var(--text-primary);
                margin: 0;
            }
            .cycle-points {
                color: var(--primary-color);
                font-weight: 600;
            }
            .cycle-description {
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
                line-height: 1.4;
            }
            .cycle-meta {
                display: flex;
                gap: 1rem;
                font-size: 0.9rem;
                color: var(--text-muted);
            }
        `;
        
        if (!document.getElementById('day-details-style')) {
            style.id = 'day-details-style';
            document.head.appendChild(style);
        }

        this.showModal('dayModal');
    }

    // Loja
    updateStore() {
        this.updateRewardsGrid();
    }

    showStoreTab(tab) {
        // Atualizar botões de tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Mostrar conteúdo da tab
        document.querySelectorAll('.rewards-grid, .history-list').forEach(content => {
            content.style.display = 'none';
        });

        if (tab === 'available') {
            document.getElementById('available-rewards').style.display = 'grid';
            this.updateRewardsGrid();
        } else if (tab === 'archived') {
            document.getElementById('archived-rewards').style.display = 'grid';
            this.updateArchivedRewards();
        } else if (tab === 'history') {
            document.getElementById('rewards-history').style.display = 'block';
            this.updateRewardsHistory();
        }
    }

    updateRewardsGrid() {
        const grid = document.getElementById('available-rewards');
        grid.innerHTML = '';

        this.data.rewards.forEach(reward => {
            const card = this.createRewardCard(reward, false);
            grid.appendChild(card);
        });
    }

    updateArchivedRewards() {
        const grid = document.getElementById('archived-rewards');
        grid.innerHTML = '';

        this.data.archivedRewards.forEach(reward => {
            const card = this.createRewardCard(reward, true);
            grid.appendChild(card);
        });
    }

    createRewardCard(reward, isArchived = false) {
        const card = document.createElement('div');
        card.className = 'reward-card';

        const canAfford = this.data.totalPoints >= reward.cost;

        card.innerHTML = `
            <div class="reward-image" style="${reward.image ? `background-image: url(${reward.image})` : ''}">
                ${!reward.image ? '<i class="fas fa-gift"></i>' : ''}
            </div>
            <h4 class="reward-title">${reward.title}</h4>
            <p class="reward-description">${reward.description || 'Sem descrição'}</p>
            <div class="reward-cost">💰 ${reward.cost} pontos</div>
            <div class="reward-actions">
                ${!isArchived ? `
                    <button class="reward-btn buy-btn" ${!canAfford ? 'disabled' : ''} onclick="workTracker.buyReward(${reward.id})">
                        ${canAfford ? 'Resgatar' : 'Sem pontos'}
                    </button>
                    <button class="reward-btn edit-btn" onclick="workTracker.editReward(${reward.id})">
                        Editar
                    </button>
                    <button class="reward-btn archive-btn" onclick="workTracker.archiveReward(${reward.id})">
                        Arquivar
                    </button>
                ` : `
                    <button class="reward-btn unarchive-btn" onclick="workTracker.unarchiveReward(${reward.id})">
                        Desarquivar
                    </button>
                    <button class="reward-btn delete-btn" onclick="workTracker.deleteReward(${reward.id})">
                        Excluir
                    </button>
                `}
            </div>
        `;

        return card;
    }

    showRewardModal(reward = null) {
        const modal = document.getElementById('rewardModal');
        const title = document.getElementById('rewardModalTitle');
        const form = document.getElementById('rewardForm');

        if (reward) {
            title.textContent = 'Editar Recompensa';
            document.getElementById('rewardTitle').value = reward.title;
            document.getElementById('rewardDescription').value = reward.description || '';
            document.getElementById('rewardCost').value = reward.cost;
            document.getElementById('rewardImage').value = reward.image || '';
            form.dataset.editId = reward.id;
        } else {
            title.textContent = 'Nova Recompensa';
            form.reset();
            delete form.dataset.editId;
        }

        this.showModal('rewardModal');
    }

    saveReward() {
        const form = document.getElementById('rewardForm');
        const title = document.getElementById('rewardTitle').value;
        const description = document.getElementById('rewardDescription').value;
        const cost = parseInt(document.getElementById('rewardCost').value);
        const image = document.getElementById('rewardImage').value;

        const reward = {
            id: form.dataset.editId ? parseInt(form.dataset.editId) : Date.now(),
            title,
            description,
            cost,
            image
        };

        if (form.dataset.editId) {
            // Editar recompensa existente
            const index = this.data.rewards.findIndex(r => r.id === reward.id);
            if (index !== -1) {
                this.data.rewards[index] = reward;
            }
        } else {
            // Nova recompensa
            this.data.rewards.push(reward);
        }

        this.saveData();
        this.updateStore();
        this.closeModal('rewardModal');
    }

    buyReward(rewardId) {
        const reward = this.data.rewards.find(r => r.id === rewardId);
        if (!reward || this.data.totalPoints < reward.cost) return;

        if (confirm(`Resgatar "${reward.title}" por ${reward.cost} pontos?`)) {
            this.data.totalPoints -= reward.cost;
            
            // Adicionar ao histórico
            this.data.rewardHistory.push({
                ...reward,
                redeemedAt: new Date().toISOString()
            });

            this.saveData();
            this.updateDisplay();
            this.updateStore();
        }
    }

    editReward(rewardId) {
        const reward = this.data.rewards.find(r => r.id === rewardId);
        if (reward) {
            this.showRewardModal(reward);
        }
    }

    archiveReward(rewardId) {
        const index = this.data.rewards.findIndex(r => r.id === rewardId);
        if (index !== -1) {
            const reward = this.data.rewards.splice(index, 1)[0];
            this.data.archivedRewards.push(reward);
            this.saveData();
            this.updateStore();
        }
    }

    unarchiveReward(rewardId) {
        const index = this.data.archivedRewards.findIndex(r => r.id === rewardId);
        if (index !== -1) {
            const reward = this.data.archivedRewards.splice(index, 1)[0];
            this.data.rewards.push(reward);
            this.saveData();
            this.updateArchivedRewards();
            this.updateRewardsGrid();
        }
    }

    deleteReward(rewardId) {
        if (confirm('Excluir esta recompensa permanentemente?')) {
            const index = this.data.archivedRewards.findIndex(r => r.id === rewardId);
            if (index !== -1) {
            this.data.archivedRewards.splice(index, 1);
            this.saveData();
            this.updateArchivedRewards();
            }
        }
    }

    updateRewardsHistory() {
        const container = document.getElementById('rewards-history');
        container.innerHTML = '';

        if (this.data.rewardHistory.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Nenhuma recompensa resgatada ainda.</p>';
            return;
        }

        this.data.rewardHistory
            .sort((a, b) => new Date(b.redeemedAt) - new Date(a.redeemedAt))
            .forEach(reward => {
                const item = document.createElement('div');
                item.className = 'history-item';
                
                const date = new Date(reward.redeemedAt).toLocaleDateString('pt-BR');
                const time = new Date(reward.redeemedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                item.innerHTML = `
                    <div class="history-info">
                        <h4>${reward.title}</h4>
                        <p>Resgatado em ${date} às ${time}</p>
                    </div>
                    <div class="history-cost">-${reward.cost} pts</div>
                `;

                container.appendChild(item);
            });
    }

    // Configurações
    updateSettings() {
        document.getElementById('accentColor').value = this.data.settings.accentColor;
        document.getElementById('dailyGoalSetting').value = this.data.settings.dailyGoal;
        document.getElementById('goalBonus').value = this.data.settings.goalBonus;
        document.getElementById('timeWeight').value = this.data.settings.timeWeight;
        document.getElementById('performanceWeight').value = this.data.settings.performanceWeight;
    }

    updateAccentColor(color) {
        this.data.settings.accentColor = color;
        this.saveData();
        this.applySettings();
    }

    updateSecondaryColor(color) {
        this.data.settings.secondaryColor = color;
        this.saveData();
        this.applySettings();
    }

    applySettings() {
        document.documentElement.style.setProperty("--primary-color", this.data.settings.accentColor);
        document.documentElement.style.setProperty("--primary-color-rgb", hexToRgb(this.data.settings.accentColor));
        document.documentElement.style.setProperty("--secondary-color", this.data.settings.secondaryColor);
        document.documentElement.style.setProperty("--secondary-color-rgb", hexToRgb(this.data.settings.secondaryColor));
    }

    // Export/Import
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `worktracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (confirm("Importar dados irá substituir todos os dados atuais. Continuar?")) {
                    this.data = { ...this.data, ...importedData };
                    this.saveData();
                    this.updateDisplay();
                    this.applySettings();
                    this.updateStore();
                    this.updateReports();
                    alert("Dados importados com sucesso!");
                }
            } catch (error) {
                alert('Erro ao importar dados. Verifique se o arquivo é válido.');
            }
        };
        reader.readAsText(file);
    }

    // Atualização da interface
    updateDisplay() {
        // Atualizar pontos totais
        document.getElementById('totalPoints').textContent = this.data.totalPoints.toLocaleString('pt-BR');

        // Atualizar progresso diário
        const todayPoints = this.getTodayPoints();
        const dailyGoal = this.data.settings.dailyGoal;
        const progress = Math.min(100, (todayPoints / dailyGoal) * 100);

        document.getElementById('dailyPoints').textContent = todayPoints.toLocaleString('pt-BR');
        document.getElementById('dailyGoal').textContent = dailyGoal.toLocaleString('pt-BR');
        document.getElementById('dailyProgressFill').style.width = `${progress}%`;
    }

    // Modals
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        modal.style.display = 'flex';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Adicionar estilos para notificação de meta
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes goalPop {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    .notification-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .notification-content h4 {
        margin: 0;
        font-size: 1.2rem;
    }
    
    .notification-content p {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.9;
    }
`;
document.head.appendChild(notificationStyle);

// Inicializar aplicação
let workTracker;
document.addEventListener('DOMContentLoaded', () => {
    workTracker = new WorkTracker();
});



// Função auxiliar para converter HEX para RGB
function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}