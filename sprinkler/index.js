const frontInput =  document.querySelector('#front-radio')
const backInput =  document.querySelector('#back-radio')
const leftInput =  document.querySelector('#left-radio')
const rightInput =  document.querySelector('#right-radio')

const frontLed = document.querySelector('#front-led')
const backLed = document.querySelector('#back-led')
const leftLed = document.querySelector('#left-led')
const rightLed = document.querySelector('#right-led')

const zones = ['front','back','left','right']

let timeRemaining = 0
let timerId

let power = 1

const timeOutput = document.querySelector('.time-output')

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
        halt()
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
    while(checkbox.checked != false && power===1)
    {
        for(let i=1;i<=4;i++) {
            for(let zone in zoneOrder) {
                if(zoneOrder[zone]===i) {
                    if(checkbox.checked === false && power===0) {
                        break
                    }
                    ledOn(zone)
                    timeRunner(zone)
                    await sleep(zoneTime[zone]*1000)
                    await sleep(1000)
                    ledOff(zone)
                    break
                }
            }
            if(checkbox.checked === false && power===0) {
                break
            }
        }
    }
}



function timeRunner(zone) {
    timeRemaining = zoneTime[zone]
    timeDec()
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

function timeDec() {

    timeOutput.innerText = `00:${timeRemaining.toString().padStart(2,'0')}`
    if(timeRemaining === 0)
    {
        clearInterval(timerId)
        return
    }
    timeRemaining -= 1

}

document.querySelector('#reset-button').addEventListener('click',reset)

function reset() {
    restore()
    frontInput.checked= true
    timeInput.value = 1
    orderInput.value =1
}

function halt() {
    clearInterval(timerId)
    timeOutput.innerText = '00:00'
    for(let zone of zones) {
        ledOff(zone)
    }

}

let offButton = document.querySelector('#off-button')

offButton.addEventListener('click',offOn)

function offOn() {
    if( offButton.value === 'OFF') {
        power = 0
        offButton.value = 'On'
        halt()
        reset()
        checkbox.checked = false
    } else if( offButton.value === 'On') {
        power = 1
        offButton.value = 'OFF'
    }
}