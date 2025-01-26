const productsContainer = document.querySelector('#products');
let currentPage = 1;
let productsPerPage = 20;

function fetchProducts(page) {
    fetch(`https://dummyjson.com/products?limit=${productsPerPage}&skip=${(page - 1) * productsPerPage}`)
        .then(response => response.json())
        .then(data => {
            productsContainer.innerHTML = '';
            data.products.forEach(product => {
                const div = document.createElement('div');
                div.classList.add('product');
                div.innerHTML = `
                    <div class="card">
                        <img src="${product.thumbnail}" alt="${product.title}" style="width:100%">
                        <h1>${product.title.slice(0, 20)}</h1>
                        <p class="price">${product.price}$</p>
                        <p>${product.description.slice(0, 20)}...</p>
                        <p><button class="view-product-btn" data-id="${product.id}">View Product</button></p>
                          <button class="addcardbutton"data-id="${product.id}">Add Product</button>

                    </div>
                `;
                productsContainer.appendChild(div);
            });

            // to open single products card to seen product details
            const viewProductButtons = document.querySelectorAll('.view-product-btn');
            viewProductButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = event.currentTarget.getAttribute('data-id');

                    window.open(`second.html?id=${productId}`, '');
                });
            });

            prevButton.disabled = page === 1;
            nextButton.disabled = data.products.length < productsPerPage;
        })
        .catch(error => console.error('Error fetching products:', error));
}
//  To Open Single Information Window For Products 
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
            // Check if the product has the required properties before using them
            document.getElementById('product-thumbnail').src = product.thumbnail || 'default-thumbnail.jpg';
            document.getElementById('product-name').textContent = product.title || 'No title available';
            document.getElementById('product-price').textContent = `${product.price}$` || 'No price available';
            document.getElementById('product-description').textContent = product.description || 'No description available';
        })
        .catch(error => console.error('Error fetching product details:', error));
};


// Pagination For Cards 20, 30, 40
const prevButton = document.querySelector('#prev-btn');
const nextButton = document.querySelector('#next-btn');
const btn20 = document.getElementById('btn-20');
const btn30 = document.getElementById('btn-30');
const btn40 = document.getElementById('btn-40');
nextButton.addEventListener('click', () => {
    currentPage++;
    fetchProducts(currentPage);
});

prevButton.addEventListener('click', () => {
    currentPage--;
    fetchProducts(currentPage);
});

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

fetchProducts(currentPage);

// Search pagination 
const productsContainerDifferent = document.getElementById('products');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

let searchQuery = '';
let currentPageSecond = 1;
const resultsPerPage = 10;

function fetchSearchResults(query, page) {
    const skip = (page - 1) * resultsPerPage;
    const url = `https://dummyjson.com/products/search?q=${query}&limit=${resultsPerPage}&skip=${skip}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            displayProducts(data.products);
            handlePagination(data.total, page);
        })
        .catch((error) => console.error('Error fetching search results:', error));
}

function displayProducts(products) {
    productsContainer.innerHTML = '';

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach((product) => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.innerHTML = `
            <div class="card">
                <img src="${product.thumbnail}" alt="${product.title}" style="width:100%">
                <h1>${product.title.slice(0, 20)}</h1>
                <p class="price">${product.price}$</p>
                <p>${product.description.slice(0, 20)}</p>
                  <p><button class="view-product-btn" data-id="${product.id}">View Product</button></p>
            </div>
                            <button class="addcardbutton"data-id="${product.id}">Add Product</button>

        `;
        productsContainer.appendChild(div);
    });
}


// Searched products pagination 
function handlePagination(totalResults, page) {
    prevButton.disabled = page === 1;
    nextButton.disabled = page * resultsPerPage >= totalResults;
}

searchButton.addEventListener('click', () => {
    searchQuery = searchInput.value.trim();
    if (searchQuery) {
        currentPage = 1;
        fetchSearchResults(searchQuery, currentPage);
    }
});


fetchSearchResults('', currentPage);

const productsContainerSecond = document.getElementById('products');
const searchInputSecond = document.getElementById('searchInput');
const searchButtonSecond = document.getElementById('searchButton');
let searchQuerySecond = '';
let currentPageThird = 1;
const resultsPerPageSecond = 10;

function fetchSearchResults(query, page) {
    const skip = (page - 1) * resultsPerPage;
    const url = `https://dummyjson.com/products/search?q=${query}&limit=${resultsPerPage}&skip=${skip}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            displayProducts(data.products);
            handlePagination(data.total, page);
        })
        .catch((error) => console.error('Error fetching search results:', error));
}

function displayProducts(products) {
    productsContainer.innerHTML = '';

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach((product) => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.innerHTML = `
            <div class="card">
                <img src="${product.thumbnail}" alt="${product.title}" style="width:100%">
                <h1>${product.title.slice(0, 10)}</h1>
                <p class="price">${product.price}$</p>
                <p>${product.description.slice(0, 10)}...</p>
                <p><button class="view-product-btn" data-id="${product.id}">View Product</button></p>
                <button class="addcardbutton"data-id="${product.id}">Add Product</button>
           
                
            </div>
        `;
        productsContainer.appendChild(div);
    });

    attachViewProductEvents();
}

function handlePagination(totalResults, page) {
    prevButton.disabled = page === 1;
    nextButton.disabled = page * resultsPerPage >= totalResults;
}

function attachViewProductEvents() {
    const viewProductButtons = document.querySelectorAll('.view-product-btn');
    viewProductButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-id');
            window.location.href = `second.html?id=${productId}`;
        });
    });
}

searchButton.addEventListener('click', () => {
    searchQuery = searchInput.value.trim();
    if (searchQuery) {
        currentPage = 1;
        fetchSearchResults(searchQuery, currentPage);
    }
});


fetchSearchResults('', currentPage);

// for cart 
const iconCartSpan = document.querySelector('.icon-cart span');
const body = document.querySelector('body');

document.querySelector('.icon-cart').addEventListener('click', () => {
    body.classList.toggle('showCart');
});

