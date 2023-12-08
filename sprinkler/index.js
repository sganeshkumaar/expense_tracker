const frontInput =  document.querySelector('#front-radio')
const backInput =  document.querySelector('#back-radio')
const leftInput =  document.querySelector('#left-radio')
const rightInput =  document.querySelector('#right-radio')

const frontLed = document.querySelector('#front-led')
const backLed = document.querySelector('#back-led')
const leftLed = document.querySelector('#left-led')
const rightLed = document.querySelector('#right-led')

let timeRemaining = 0
let timerId

const timeInput = document.querySelector('#zone-time-input')
const orderInput = document.querySelector('.order-setting input')

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve,delay))

timeInput.addEventListener('change',timeChange)

function timeChange() {
    if(timeInput.value < 1) {
        timeInput.value = 1 
    }
    if(this.value > 15) {
        timeInput.value = 15
    }
}


frontInput.addEventListener('click',radioClick)
backInput.addEventListener('click',radioClick)
leftInput.addEventListener('click',radioClick)
rightInput.addEventListener('click',radioClick)



function radioClick() {
    let zone = this.value
    zoneOrder[zone] = parseInt(orderInput.value)
    zoneTime[zone] = parseInt(timeInput.value)
}

const checkbox = document.querySelector('#check-box')

const zoneOrder = {
    front :1,
    back: 2,
    right: 3,
    left: 4
}

const zoneTime = {
    front:1,
    back:1,
    left:1,
    right:1
}


checkbox.addEventListener('click',actionOnCheckBoxClick)

function actionOnCheckBoxClick() {

    if(this.checked === false) {
        return
    }
    let orders = Object.values(zoneOrder)
    orders.sort()
    for(let i=0;i<3;i++){
        if(orders[i]===orders[i+1]) {
            alert('Please enter different orders for different different zones')
            checkbox.checked=false
            restore()
            frontInput.checked = true
            return
        }
    }

    process()


}

function restore() {
    zoneOrder.front = 1
    zoneOrder.back =2
    zoneOrder.right =3
    zoneOrder.left =4

    for(let i in zoneTime) {
        zoneTime[i] = 1
    }
}


async function process() {
    for(let i=1;i<=4;i++) {
        for(let zone in zoneOrder) {
            if(zoneOrder[zone]===i) {
                ledOn(zone)
                timeRunner(zone)
                await sleep(zoneTime[zone]*1000)
                ledOff(zone)
                break
            }
        }
    }
}



function timeRunner(zone) {
    timeRemaining = zoneTime[zone]
    timerId = setInterval(timeDec,1000)
}

function ledOn(zone) {
    if(zone === 'front') {
        frontLed.style.backgroundColor ='red'
    } else if(zone === 'back') {
        backLed.style.backgroundColor ='red'
    } else if(zone === 'left') {
        leftLed.style.backgroundColor ='red'
    } else if(zone === 'right') {
        rightLed.style.backgroundColor ='red'
    }
}

function ledOff(zone) {
    if(zone === 'front') {
        frontLed.style.backgroundColor ='rgb(202, 233, 222)'
    } else if(zone === 'back') {
        backLed.style.backgroundColor ='rgb(202, 233, 222)'
    } else if(zone === 'left') {
        leftLed.style.backgroundColor ='rgb(202, 233, 222)'
    } else if(zone === 'right') {
        rightLed.style.backgroundColor ='rgb(202, 233, 222)'
    }
}


