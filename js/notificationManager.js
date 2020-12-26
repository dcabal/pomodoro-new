function askPermission() {
    if (Notification.permission !== 'granted')
        Notification.requestPermission();
}

function showNotification(type = 'work' | 'rest') {
    if (Notification.permission === 'granted') {
        if (type === 'work')
            new Notification('Pomodoro', {body: '¡Hora de descansar!'});
        else 
            new Notification('Pomodoro', {body: '¡Se acabó el descanso!'});
    }
}