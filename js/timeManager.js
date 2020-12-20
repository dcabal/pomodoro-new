self.onmessage = msg => startTimer(Number(msg.data));
function startTimer(time) {
    let timeMills = time * 60 * 1000;
    
    setInterval(() => {
        timeMills -= 1000;
        timeMills >= 0 ? postMessage(timeMills) : clearInterval(this);
    }, 100);
}