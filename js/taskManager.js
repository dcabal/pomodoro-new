function getTasks() {
    let tasks = Object.keys(localStorage).sort();
    $('#listaTareas').empty();
    for (let t of tasks) {
        $('#listaTareas').append(`<li>${localStorage.getItem(t)}: ${(new Date(t)).toLocaleString('es-ES')}</li>`);
    }
}

function startTask(name) {
    let now = new Date();
    localStorage.setItem(now.toISOString(), name);
    $('#actual').text(name);
}
