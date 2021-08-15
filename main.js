console.log('praise cage')


let sequence = []
let humanSequence = []
let level = 0

const startButton = document.querySelector('.js-start')
const info = document.querySelector('.js-info')

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

  const nextSequence = [...sequence]
  nextSequence.push(nextStep())
  playRound(nextSequence)
}


function startGame() {
  startButton.classList.add('hidden')
  info.classList.remove('hidden')
  info.textContent = 'Wait for the computer'
  nextRound()
}

startButton.addEventListener('click', startGame)
