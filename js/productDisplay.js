// productDisplay.js
const productsContainer = document.querySelector('#products');

let currentPage = 1;
let productsPerPage = 20;
let searchQuery = '';

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

function handlePagination(total, page) {
    const prevButton = document.querySelector('#prev-btn');
    const nextButton = document.querySelector('#next-btn');

    prevButton.disabled = page === 1;
    nextButton.disabled = page * productsPerPage >= total;

    prevButton.addEventListener('click', () => {
        currentPage--;
        fetchProducts(currentPage, searchQuery);
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        fetchProducts(currentPage, searchQuery);
    });
}
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

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    fetchProducts(currentPage, searchQuery);
});

fetchProducts(currentPage);
