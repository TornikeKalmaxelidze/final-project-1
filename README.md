# Final Project

Create a website that uses APIs to display data in a meaningful way. The website should have a homepage that explains what the website does and how to use it. The website should have at least two other pages that display data from APIs. The website should be responsive and look good on both desktop and mobile.

## Requirements
- Make **at least** following API calls:
    - [x] List of items
    - [x] Details of an item
    - [x] Search for an item
    - [x] Pagination
- DOM mainpulation, fetched data should be displayed on the pages:
    - [x] Create a page for list of items (This should include search and pagination)
    - [x] Create a page for details of an item
- Use localStorage to store user preferences (e.g. dark mode)
- Use sessionStorage to store temporary data (e.g. shopping cart)
- Use cookies to store user data (e.g. username)
- Use JavaScript imports to modularize your code


#### If you cannot think of a project idea, here are some suggestions:

- Weather app
    - [x] API to get the weather: [OpenWeatherMap](https://openweathermap.org/api)
    - [x] Display list of popular cities (e.g. New York, London, Tokyo)
    - [x] Display the weather forecast for a current location (use the browser's geolocation API)
    - [x] Add search functionality to search for a city
- Movie app
    - [x] API to get a movies: [The Movie Database](https://www.themoviedb.org/documentation/api)
    - [x] Display a list of popular movies
    - [x] Display details of a movie
    - [x] Add search functionality to search for a movie
- Recipe app
    - [x] API to get recipes: [TheMealDB](https://www.themealdb.com/api.php)
    - [x] Display a list of popular recipes
    - [x] Display details of a recipe
    - [x] Add search functionality to search for a recipe
- Music app
    - [x] API to get music: [Spotify](https://developer.spotify.com/documentation/web-api/)
    - [x] Display a list of popular songs
    - [x] Display details of a song
    - [x] Add search functionality to search for a song

You can use any other API that you like, as long as you meet the requirements.

let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    // get data product
    fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();
