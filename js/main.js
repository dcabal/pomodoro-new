let totalTime = 25 * 60 * 1000;
let worker = null;
let mode = 'work';

$(function() {
    askPermission();
    $('#tareaActual').hide();
    $('#descanso').hide();

    updateTime();
    getTasks();
    $('#empezar').on('click', saveTask);
    $('#tiempoTarea').on('change', updateTime);
    $('#tiempoDescanso').on('change', updateTime);
    $('#nombreTarea').on('keyup', enableStart);
    $('#descansar').on('click', rest);
    $('#iniciarDescanso').on('click', startRest);
    $('#trabajar').on('click', backToWork);
});

/* Guarda la tarea y arranca el contador */
function saveTask() {
    startTask($('#nombreTarea').val());
    $('#nuevaTarea').hide();
    $('#tareaActual').show();
    startTimer();
}

/* Actualiza el tiempo mostrado de la duración de la tarea y el descanso */
function updateTime() {
    const time = mode === 'work' ? $('#tiempoTarea') : $('#tiempoDescanso');
    const output = mode === 'work' ? $('#duracionTarea') : $('#duracionDescanso');
    const progress = mode === 'work' ? $('#progressTarea') : $('#progressDescanso');

    totalTime = Number(time.val()) * 60 * 1000;
    output.text(totalTime / 60 / 1000);
    progress.attr('max', totalTime);
}

/* Habilita el botón de inicio de la tarea */
function enableStart() {
    !!$('#nombreTarea').val() ? $('#empezar').removeAttr('disabled') : $('#empezar').attr('disabled', 'disabled');
}

/* Inicia el cronómetro */
function startTimer() {
    const range = mode === 'work' ? $('#tiempoTarea') : $('#tiempoDescanso');
    if(Worker) {
        worker = new Worker('./js/timeManager.js');
        worker.postMessage(range.val());
        worker.onmessage = e => showTimer(Number(e.data));
    }
}

/* Refresca el temporizador */
function showTimer(time) {
    const stringTime = `${String(Math.floor(time / 1000 / 60)).padStart(2, '0')}:${String(time / 1000 % 60).padStart(2, '0')}`;
    const output = mode === 'work' ? $('#tareaRestante') : $('#descansoRestante');
    const progress = mode === 'work' ? $('#progressTarea') : $('#progressDescanso');
    
    output.text(stringTime);
    progress.val(totalTime - time);

    if (!time) {
        if (mode === 'work'){
            $('#descansar').removeAttr('disabled');
        } else {
            $('#trabajar').show();
        }
        worker.terminate();
        showNotification(mode);
    }
}

/* Muestra el temporizador de descanso */
function rest() {
    mode = 'rest';
    $('#tareaActual').hide();
    $('#descanso').show();
    $('#iniciarDescanso').show();
    $('#descansar').attr('disabled', 'disabled');
    $('#trabajar').hide();
    $('#infoDescanso').hide();
    $('#progressDescanso').hide();
    updateTime();
}

/* Comienza el descanso */
function startRest() {
    $('#infoDescanso').show();
    $('#progressDescanso').show();
    $('#iniciarDescanso').hide();
    startTimer();
}

/* Vuelve al inicio */
function backToWork() {
    mode = 'work';
    $('#descanso').hide();
    $('#nuevaTarea').show();
    $('#nombreTarea').val('');
    $('#tiempoTarea').val('25');
    $('#empezar').attr('disabled', 'disabled');
    updateTime();
}


