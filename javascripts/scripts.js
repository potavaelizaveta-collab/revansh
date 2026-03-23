document.addEventListener('DOMContentLoaded', function () {
  const swiperWrapper = document.querySelector('.swiper-wrapper')
  const leftArrow = document.querySelector('.left-arrow')
  const rightArrow = document.querySelector('.right-arrow')
  const slides = document.querySelectorAll('.swiper-slide')

  let currentIndex = 0

  function updateSwiper() {
    swiperWrapper.style.transform = `translateX(-${currentIndex * 100}%)`
  }

  leftArrow.addEventListener('click', function () {
    if (currentIndex > 0) {
      currentIndex--
      updateSwiper()
    }
  })

  rightArrow.addEventListener('click', function () {
    if (currentIndex < slides.length - 1) {
      currentIndex++
      updateSwiper()
    }
  })

  const doneButton = document.querySelector('.done-button')
  const inputWindow = document.querySelector('.input-window')

  doneButton.addEventListener('click', function () {
    inputWindow.style.display = 'flex'
  })

  const submitButton = document.querySelector('.submit-button')
  const nameInput = document.querySelector('#nameInput')
  const playerNamePlate = document.querySelector('#playerName')

  submitButton.addEventListener('click', function (event) {
    event.preventDefault()
    const playerName = nameInput.value.trim()

    if (playerName !== '') {
      playerNamePlate.textContent = playerName
    }

    inputWindow.style.display = 'none'
  })
})

function dragAndDropPuzzles() {
  const pieces = document.querySelectorAll('.puzzle-piece')
  const drops = document.querySelectorAll('.drop-zone')
  const cup = document.querySelector('.cup-final')
  let cnt = 0

  pieces.forEach((piece) => {
    piece.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', event.target.classList[1])
    })
  })

  drops.forEach((container) => {
    container.addEventListener('dragover', (event) => {
      event.preventDefault()
    })

    container.addEventListener('drop', (event) => {
      event.preventDefault()

      const pieceClass = event.dataTransfer.getData('text/plain')
      const dropClass = pieceClass.replace('piece', 'drop')

      const drop = document.querySelector(`.${dropClass}`)
      const drag = document.querySelector(`.${pieceClass}`)
      if (container === drop) {
        drop.classList.add('image')
        drag.style.display = 'none'
        cnt++

        if (cnt === 4) {
          cup.style.display = 'block'
        }
      }
    })
  })
}

dragAndDropPuzzles()

const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')
let isDrawing = false
let lastX = 0
let lastY = 0

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
}

function getAdjustedCoordinates(e, canvas) {
  const rect = canvas.getBoundingClientRect()
  const angle = (32 * Math.PI) / 180

  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const mouseX = e.clientX - centerX
  const mouseY = e.clientY - centerY

  const cos = Math.cos(-angle)
  const sin = Math.sin(-angle)
  const adjustedX = mouseX * cos - mouseY * sin
  const adjustedY = mouseX * sin + mouseY * cos

  return {
    x: adjustedX + rect.width / 2,
    y: adjustedY + rect.height / 2
  }
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true
  const { x, y } = getAdjustedCoordinates(e, canvas)
  lastX = x
  lastY = y
})

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return
  const { x, y } = getAdjustedCoordinates(e, canvas)

  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 3
  ctx.stroke()

  lastX = x
  lastY = y
})

canvas.addEventListener('mouseup', () => (isDrawing = false))
canvas.addEventListener('mouseleave', () => (isDrawing = false))

window.addEventListener('load', resizeCanvas)
window.addEventListener('resize', resizeCanvas)
