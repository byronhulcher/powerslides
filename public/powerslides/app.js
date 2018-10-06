/* global _ */
let slideElement = document.querySelector('.slide')
let timerElement = document.querySelector('.wrapper')
let slides = []
let slideIndex = 0
let maxSlides = 6
let timerTimeout

function updateSlide () {
  clearTimeout(timerTimeout)
  slideElement.style['background-image'] = `url(${slides[slideIndex].s3Url})`

  timerElement.classList.remove('animated')
  void timerElement.offsetWidth
  timerElement.classList.add('animated')

  timerTimeout = setTimeout(nextSlide, 1000 * 25)

  document.querySelector('.slidebar').innerHTML = `${slideIcons.slice(0, maxSlides).map((iconName, index) => `<icon class="material-icons ${slideIndex < index ? 'faded' : ''}">${iconName}</icon>`).join('')}`
}

function resetSlides () {
  if (slides.length === 0) {
    return
  }

  slideIndex = 0
  slides = _.shuffle(slides)
  slideIcons = _.shuffle(slideIcons)
  updateSlide()
}

function nextSlide () {
  slideIndex = Math.min(slideIndex + 1, maxSlides - 1, slides.length)
  updateSlide()
}

function previousSlide () {
  slideIndex = Math.max(slideIndex - 1, 0)
  updateSlide()
}

let slideIcons = [
  'add_shopping_cart',
  'account_balance_wallet',
  'account_box',
  'announcement',
  'aspect_ratio',
  'assignment_turned_in',
  'bug_report',
  'camera_enhance',
  'card_giftcard',
  'commute',
  'contact_support',
  'dashboard',
  'date_range',
  'delete_forever',
  'delete_outline',
  'dns',
  'donut_small',
  'event_seat',
  'exit_to_app',
  'explore',
  'extension',
  'face',
  'favorite_border',
  'feedback',
  'find_in_page',
  'fingerprint',
  'gavel',
  'grade',
  'group_work',
  'home',
  'important_devices',
  'info',
  'language',
  'loyalty',
  'motorcycle',
  'offline_bolt',
  'pan_tool',
  'perm_data_setting',
  'perm_media',
  'pets',
  'redeem',
  'report_problem',
  'rowing',
  'settings_phone',
  'shopping_basket',
  'speaker_notes',
  'supervised_user_circle',
  'verified_user'
]

async function main () {
  let mediaResponse = await window.fetch('/media/')

  slides = await mediaResponse.json()
  resetSlides()

  document.querySelector('.previous-slide').addEventListener('click', previousSlide)
  document.querySelector('.next-slide').addEventListener('click', nextSlide)
  document.addEventListener('keyup', function (event) {
    var key = event.key || event.keyCode

    switch (key) {
      case 37:
      case 'ArrowLeft':
        previousSlide()
        break
      case 39:
      case 'ArrowRight':
        nextSlide()
        break
    }
  })
}

main()
