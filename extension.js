const vscode = require('vscode');
let activeStartTime = null;
let totalCodingTime = 0;

/**
 * Форматирование времени (в миллисекундах) в строку вида ЧЧ:ММ:СС
 */
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Фиксация начала активности
 */
function startTracking() {
    if (activeStartTime === null) {
        activeStartTime = Date.now();
    }
}

/**
 * Остановка трекинга и добавление времени к общему
 */
function stopTracking() {
    if (activeStartTime !== null) {
        totalCodingTime += Date.now() - activeStartTime;
        activeStartTime = null;
    }
}

/**
 * Активация расширения
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Отслеживание изменений в редакторе
    vscode.workspace.onDidChangeTextDocument(() => {
        startTracking();
    });

    // Смена активного редактора
    vscode.window.onDidChangeActiveTextEditor(() => {
        startTracking();
    });

    // Изменение состояния окна (свёрнуто/активно)
    vscode.window.onDidChangeWindowState((state) => {
        if (!state.focused) {
            stopTracking();
        }
    });

    // Регистрация команды для отображения времени
    const disposable = vscode.commands.registerCommand('codingTimer.showTime', () => {
        stopTracking();
        vscode.window.showInformationMessage(`Total coding time: ${formatTime(totalCodingTime)}`);
    });

    context.subscriptions.push(disposable);
}

/**
 * Деактивация расширения
 */
function deactivate() {
    stopTracking();
}

module.exports = {
    activate,
    deactivate,
};
