const productsContainer = document.querySelector('#products');
const listCart = document.querySelector('.listCart');
const iconCartSpan = document.querySelector('.icon-cart span');
const body = document.querySelector('body');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

let currentPage = 1;
let productsPerPage = 20;
let cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];  // Load cart from sessionStorage
let searchQuery = '';

// To seen Products details 
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (productId) {
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                throw new Error('Product not found');
            }
            return response.json();
        })
        .then(product => {
            document.getElementById('product-thumbnail').src = product.thumbnail || 'default-thumbnail.jpg';
            document.getElementById('product-name').textContent = product.title || 'No title available';
            document.getElementById('product-price').textContent = `${product.price}$` || 'No price available';
            document.getElementById('product-description').textContent = product.description || 'No description available';
        })
        .catch(error => console.error('Error fetching product details:', error));
};

// To Open Cart selection
document.querySelector('.icon-cart').addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// To Open More cards Pagination of 20, 30, 40 
const btn20 = document.getElementById('btn-20');
const btn30 = document.getElementById('btn-30');
const btn40 = document.getElementById('btn-40');

btn20.addEventListener('click', () => {
    productsPerPage = 20;
    currentPage = 1;
    fetchProducts(currentPage);
});

btn30.addEventListener('click', () => {
    productsPerPage = 30;
    currentPage = 1;
    fetchProducts(currentPage);
});

btn40.addEventListener('click', () => {
    productsPerPage = 40;
    currentPage = 1;
    fetchProducts(currentPage);
});


// Fetched products
function fetchProducts(page, query = '') {
    const skip = (page - 1) * productsPerPage;
    const url = query
        ? `https://dummyjson.com/products/search?q=${query}&limit=${productsPerPage}&skip=${skip}`
        : `https://dummyjson.com/products?limit=${productsPerPage}&skip=${skip}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayProducts(data.products);
            handlePagination(data.total, page);
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Render products to seen
function displayProducts(products) {
    productsContainer.innerHTML = '';

    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.innerHTML = `
            <div class="card">
                <img src="${product.thumbnail}" alt="${product.title}" style="width:100%">
                <h1>${product.title.slice(0, 20)}</h1>
                <p class="price">${product.price}$</p>
                <p>${product.description.slice(0, 50)}...</p>
                <button class="view-product-btn" data-id="${product.id}">View Product</button>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(div);
    });

    attachEventListeners();
}

//  event listeners for buttons
function attachEventListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        });
    });

    document.querySelectorAll('.view-product-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            window.open(`second.html?id=${productId}`, '_blank');
        });
    });
}

// Pagination for back & next page
const prevButton = document.querySelector('#prev-btn');
const nextButton = document.querySelector('#next-btn');
function handlePagination(total, page) {
    prevButton.disabled = page === 1;
    nextButton.disabled = page * productsPerPage >= total;
}

prevButton.addEventListener('click', () => {
    currentPage--;
    fetchProducts(currentPage, searchQuery);
});

nextButton.addEventListener('click', () => {
    currentPage++;
    fetchProducts(currentPage, searchQuery);
});

// For SearchBar
searchButton.addEventListener('click', () => {
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    fetchProducts(currentPage, searchQuery);
});

// Add to cart
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

// Update the cart display
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

// Change cart item quantity
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

// Save cart to sessionStorage
function saveCartToSession() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Proceed to Checkout (in Cart page)
function proceedToCheckout() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// Initialize cart when the page loads
function loadCartFromSession() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];
    updateCart();
}

loadCartFromSession();
fetchProducts(currentPage);
