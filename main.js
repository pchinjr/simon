console.log('praise cage')

let sequence = []
let humanSequence = []
let level = 0

const startButton = document.querySelector('.js-start')
const info = document.querySelector('.js-info')
const heading = document.querySelector('.js-heading')
const titleContainer = document.querySelector('.js-container')


function resetGame(text) {
  alert(text)
  sequence = []
  humanSequence = []
  level = 0
  startButton.classList.remove('hidden')
  heading.textContent = 'Simon Game'
  info.classList.add('hidden')
  tileContainer.classList.add('unclickable')
}

function humanTurn(level) {
  titleContainer.classList.remove('unclickable')
  info.textContent = `Your turn: ${level} Tap${level > 1 ? 's': ''}`
}


function activateTile(color) {
  const tile = document.querySelector(`[data-tile='${color}']`)
  const sound = document.querySelector(`[data-sound='${color}']`)

  tile.classList.add('activated')
  sound.play()

  setTimeout(() => {
    tile.classList.remove('activated')
  }, 300)
}

function playRound(nextSequence) {
  nextSequence.forEach((color, index) => {
    setTimeout( () => {
      activateTile(color)
    }, (index + 1) * 600)
  })
}

function nextStep() {
  const tiles = ['red', 'green', 'blue', 'yellow']
  const random = tiles[Math.floor(Math.random() * tiles.length)]

  return random
}

function nextRound() {
  level += 1

  titleContainer.classList.add('unclickable')
  info.textContent = 'Wait for the computer'
  heading.textContent = `Level ${level} of 20`

  const nextSequence = [...sequence]
  nextSequence.push(nextStep())
  playRound(nextSequence)

  sequence = [...nextSequence]
  setTimeout(() => {
    humanTurn(level)
  }, level * 600 + 1000);
}

function handleClick(tile) {
  const index = humanSequence.push(tile) - 1
  const sound = document.querySelector(`[data-sound='${tile}']`)
  sound.play()

  const remainingTaps = sequence.length - humanSequence.length

  if(humanSequence[index] !== sequence[index]) {
    resetGame('Oops! Game over, you pressed the wrong tile')
    return;
  }

  if (humanSequence.length === sequence.length) {
    if(humanSequence.length === 20) {
      resetGame('Congrats! You completed all the levels')
      return
    }

    humanSequence = []
    info.textContent = 'Success! Keep Going!'
    setTimeout(() => {
      nextRound()
    }, 1000);
    return
  }

  info.textContent = `Your turn: ${remainingTaps} Tap${remainingTaps > 1 ? 's' : ''}`
}


function startGame() {
  startButton.classList.add('hidden')
  info.classList.remove('hidden')
  info.textContent = 'Wait for the computer'
  nextRound()
}

startButton.addEventListener('click', startGame)

titleContainer.addEventListener('click', event => {
  const { tile } = event.target.dataset

  if (tile) handleClick(tile)
})


async function runDeviceControlExample() {
  // Instantiate our wasm module. This only needs to be done once. If you did it
  // elsewhere, ignore this.
  await Buttplug.buttplugInit();

  // Usual embedded connector setup.
  const connector = new Buttplug.ButtplugEmbeddedConnectorOptions();
  const client = new Buttplug.ButtplugClient("Device Control Example");
  await client.connect(connector);

  // Set up our DeviceAdded/DeviceRemoved event handlers before connecting. If
  // devices are already held to the server when we connect to it, we'll get
  // "deviceadded" events on successful connect.
  client.addListener("deviceadded", async (device) => {
    console.log(`Device Connected: ${device.Name}`);
    console.log("Client currently knows about these devices:");
    client.Devices.forEach((device) => console.log(`- ${device.Name}`));

    // In Javascript, allowedMessages is a map, so we'll need to iterate its
    // properties.

    console.log("Sending commands");

    // If we aren't working with a toy that vibrates, just return at this point.
    if (!device.messageAttributes(Buttplug.ButtplugDeviceMessageType.VibrateCmd)) {
      return;
    }

    // Now that we know the message types for our connected device, and that our
    // device handles vibration, we can send a message over!
    //
    // There's a couple of ways to send this message.

    // We can use the convenience functions on ButtplugClientDevice to
    // send the message. This version sets all of the motors on a
    // vibrating device to the same speed.
    let vibeButton = document.getElementById("vibe")
    vibeButton.onclick = function doSomething() {
      console.log('vibe clicked')
      device.vibrate(1.0)
    }

    let stopButton = document.getElementById("stop")
    stopButton.onclick = function doSomething() {
      console.log('stop clicked')
      device.stop()
    }

    // If we wanted to just set one motor on and the other off, we could
    // try this version that uses an array. It'll throw an exception if
    // the array isn't the same size as the number of motors available as
    // denoted by FeatureCount, though.
    //
    // You can get the vibrator count using the following code, though we
    // know it's 2 so we don't really have to use it.
    //
    // This vibrateType variable is just used to keep us under 80
    // characters for the dev guide, so don't feel that you have to reassign
    // types like this. I'm just trying to make it so you don't have to
    // horizontally scroll in the manual. :)

    /*
    var vibratorCount =
      device.AllowedMessages[vibrateType].FeatureCount;
    await testClientDevice.SendVibrateCmd(new [] { 1.0, 0.0 });
    */
  });
  client
    .addListener("deviceremoved", (device) => console.log(`Device Removed: ${device.Name}`));

  // Now that everything is set up, we can scan.
  let connectButton = document.getElementById("connect-toy")
  connectButton.onclick = function doSomething() {
    console.log('connect clicked')
    client.startScanning();
  }


};

runDeviceControlExample()