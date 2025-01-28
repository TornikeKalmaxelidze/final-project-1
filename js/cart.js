// cart.js
const listCart = document.querySelector('.listCart');
const iconCartSpan = document.querySelector('.icon-cart span');
let cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];

function addToCart(productId) {
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
            saveCartToSession();
        })
        .catch(error => console.error('Error adding product to cart:', error));
}

function updateCart() {
    listCart.innerHTML = '';
    let totalQuantity = 0;

    cart.forEach(item => {
        totalQuantity += item.quantity;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <div class="item-info">
                <img src="${item.thumbnail}" alt="${item.title}" style="width:50px;">
                <p>${item.title}</p>
                <p>${item.price}$ x ${item.quantity}</p>
            </div>
            <div class="quantity-controls">
                <button class="decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase" data-id="${item.id}">+</button>
            </div>
        `;
        listCart.appendChild(cartItemDiv);
    });

    iconCartSpan.innerText = totalQuantity;

    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            changeQuantity(productId, -1);
        });
    });

    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            changeQuantity(productId, 1);
        });
    });
}

function changeQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.quantity += change;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    updateCart();
    saveCartToSession();
}

function saveCartToSession() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function loadCartFromSession() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];
    updateCart();
}

loadCartFromSession();
