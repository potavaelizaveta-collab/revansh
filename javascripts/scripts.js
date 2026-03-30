document.addEventListener('DOMContentLoaded', function () {
  const swiperWrapper = document.querySelector('.swiper-wrapper')
  const leftArrow = document.querySelector('.left-arrow')
  const rightArrow = document.querySelector('.right-arrow')
  const slides = document.querySelectorAll('.swiper-slide')

  let currentIndex = 0

  function updateSwiper() {
    swiperWrapper.style.transform = `translateX(-${currentIndex * 100}%)`
  }

  leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--
      updateSwiper()
    }
  })

  rightArrow.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++
      updateSwiper()
    }
  })

  const doneButton = document.querySelector('.done-button')
  const inputWindow = document.querySelector('.input-window')
  const submitButton = document.querySelector('.submit-button')
  const nameInput = document.querySelector('#nameInput')
  const playerNamePlate = document.querySelector('#playerName')

  doneButton.addEventListener('click', () => {
    inputWindow.style.display = 'flex'
  })

  submitButton.addEventListener('click', (event) => {
    event.preventDefault()

    const playerName = nameInput.value.trim()

    if (playerName !== '') {
      playerNamePlate.textContent = playerName
    }

    inputWindow.style.display = 'none'
  })

  const pieces = document.querySelectorAll('.puzzle-piece')
  const drops = document.querySelectorAll('.drop-zone')
  const cup = document.querySelector('.cup-final')

  let placed = 0

  pieces.forEach((piece) => {
    piece.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', piece.classList[1])
    })
  })

  drops.forEach((drop) => {
    drop.addEventListener('dragover', (event) => {
      event.preventDefault()
    })

    drop.addEventListener('drop', (event) => {
      event.preventDefault()

      const pieceClass = event.dataTransfer.getData('text/plain')
      const piece = document.querySelector(`.${pieceClass}`)

      const correctDropClass = pieceClass.replace('piece', 'drop')

      if (drop.classList.contains(correctDropClass)) {
        // вставляем пазл внутрь слота
        drop.appendChild(piece)

        // растягиваем внутри слота
        piece.style.position = 'absolute'
        piece.style.left = '0'
        piece.style.top = '0'
        piece.style.width = '100%'
        piece.style.height = '100%'

        piece.draggable = false

        placed++

        if (placed === 4) {
          cup.style.display = 'block'
        }
      }
    })
  })

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

  function getPos(e) {
    const rect = canvas.getBoundingClientRect()

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
  }

  function startDraw(e) {
    isDrawing = true
    const pos = getPos(e)
    lastX = pos.x
    lastY = pos.y
  }

  function draw(e) {
    if (!isDrawing) return

    const pos = getPos(e)

    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 3
    ctx.stroke()

    lastX = pos.x
    lastY = pos.y
  }

  function stopDraw() {
    isDrawing = false
  }

  canvas.addEventListener('mousedown', startDraw)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseup', stopDraw)
  canvas.addEventListener('mouseleave', stopDraw)

  canvas.addEventListener('touchstart', startDraw)
  canvas.addEventListener('touchmove', draw)
  canvas.addEventListener('touchend', stopDraw)

  window.addEventListener('load', resizeCanvas)
  window.addEventListener('resize', resizeCanvas)
})
