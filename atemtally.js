const { Atem } = require('atem-connection');
const atem = new Atem();
const { SerialPort } = require('serialport')
const serialport = new SerialPort({ path: 'COM17', baudRate: 9600 })
atem.on('connected', () => {
    clearInterval(connectedtimer);
    console.log('ATEM connected');
    sendtoweb(JSON.stringify({ get: "connect", data: true }));
    tally(0, 0)
});
atem.on('disconnected', () => {
    console.log('ATEM disconnected');
    sendtoweb(JSON.stringify({ get: "error", data: "ATEM斷線，請檢查連線狀況" }));
    tally(0, 0)
});
atem.on('stateChanged', (state) => {
    tally(state.video.mixEffects[0].programInput, state.video.mixEffects[0].previewInput);
})
atem.connect("192.168.50.234");
function tally(pgm, pwv) {
    if(pgm==6000){
        serialport.write('{pgm:[1,2,3,4],pwv:0}')
    }else{
    serialport.write('{pgm:[' + pgm + '],pwv:' + pwv + '}')
    }
    console.log(pgm, pwv)
}
