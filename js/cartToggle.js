// cartToggle.js
const body = document.querySelector('body');

// To Open Cart selection
document.querySelector('.icon-cart').addEventListener('click', () => {
    body.classList.toggle('showCart');
});
