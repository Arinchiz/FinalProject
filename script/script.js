document.addEventListener('DOMContentLoaded', () => {
let navbar = document.querySelector('header .navbar'); 
let cartItemContainer = document.querySelector('.cart-items-container');
let searchForm = document.querySelector('.search-form'); 
let phoneInput = document.getElementById('phoneNumber');
let form = document.querySelector('form');
let cartItems = {};

function toggleActiveElements(activeElement) {
    [navbar, cartItemContainer, searchForm].forEach(element => {
        if (element !== activeElement) {
            element.classList.remove('active');
        }
    });
}

document.querySelector('#search-btn').onclick = () => { 
    searchForm.classList.toggle('active');
    toggleActiveElements(searchForm);
};

document.querySelector('#menu-btn').onclick = () => { 
    navbar.classList.toggle('active');
    toggleActiveElements(navbar);
};

document.querySelector('#cart-btn').onclick = () => { 
    cartItemContainer.classList.toggle('active');
    toggleActiveElements(cartItemContainer);
};

window.onscroll = () =>{
    toggleActiveElements(null);
};

const addToCartButtons = document.querySelectorAll('.box .icons .fa-shopping-cart');

// Функция для добавления товара в корзину
function addToCart(itemName, itemPrice, itemImageSrc) {
    const existingCartItem = cartItems[itemName];
    if (existingCartItem) {
        existingCartItem.counter++;
        const existingCartItemElement = cartItemContainer.querySelector(`.cart-item[data-name="${itemName}"] .counter .quantity`);
        existingCartItemElement.textContent = existingCartItem.counter;
        updateCartItemPrice(itemName, itemPrice, existingCartItem.counter); 
    } else {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.setAttribute('data-name', itemName);
        cartItem.innerHTML = `
            <div class="remove-item">
                <span class="fas fa-times"></span>
            </div>
            <img src="${itemImageSrc}" alt="">
            <div class="content">
                <h3>${itemName}</h3>
                <div class="price">$${itemPrice}</div>
                <div class="counter">
                    <button class="decrement">-</button>
                    <span class="quantity">1</span>
                    <button class="increment">+</button>
                </div>
            </div>
        `;
        cartItemContainer.insertBefore(cartItem, cartItemContainer.querySelector('.btn'));
        cartItemContainer.classList.add('active');
        cartItems[itemName] = { counter: 1, itemPrice: parseFloat(itemPrice) };

        // Добавляем обработчики событий только один раз для каждой кнопки
        const incrementButton = cartItem.querySelector('.increment');
        const decrementButton = cartItem.querySelector('.decrement');
        const quantityElement = cartItem.querySelector('.quantity');

        incrementButton.removeEventListener('click', incrementCounter); // Удаляем обработчик, если он был добавлен ранее
        decrementButton.removeEventListener('click', decrementCounter); // Удаляем обработчик, если он был добавлен ранее

        incrementButton.addEventListener('click', incrementCounter); // Добавляем обработчик
        decrementButton.addEventListener('click', decrementCounter); // Добавляем обработчик
    }
}

// Функция для обновления отображаемой цены товара в корзине
function updateCartItemPrice(itemName, itemPrice, counter) {
    const cartItem = cartItemContainer.querySelector(`.cart-item[data-name="${itemName}"]`);
    if (cartItem) {
        const priceElement = cartItem.querySelector('.price');
        const totalPrice = itemPrice * counter;
        priceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

const plusButtons = document.querySelectorAll('.cart-item .plus');

function incrementCounter(event) {
    const itemName = event.target.closest('.cart-item').getAttribute('data-name');
    cartItems[itemName].counter++;
    const counterElement = event.target.closest('.cart-item').querySelector('.counter .quantity');
    counterElement.textContent = cartItems[itemName].counter;
    updateCartItemPrice(itemName, cartItems[itemName].itemPrice, cartItems[itemName].counter);
    event.stopPropagation(); 
}

plusButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        const itemName = button.closest('.cart-item').getAttribute('data-name');
        cartItems[itemName].counter++;
        const counterElement = button.closest('.cart-item').querySelector('.counter');
        counterElement.textContent = cartItems[itemName].counter;
        updateCartItemPrice(itemName, cartItems[itemName].itemPrice, cartItems[itemName].counter); // Обновляем отображаемую цену
        event.stopPropagation(); 
    });
});

const minusButtons = document.querySelectorAll('.cart-item .minus');

function decrementCounter(event) {
    const itemName = event.target.closest('.cart-item').getAttribute('data-name');
    if (cartItems[itemName].counter > 1) {
        cartItems[itemName].counter--;
        const counterElement = event.target.closest('.cart-item').querySelector('.counter .quantity');
        counterElement.textContent = cartItems[itemName].counter;
        updateCartItemPrice(itemName, cartItems[itemName].itemPrice, cartItems[itemName].counter);
    } else {
        const cartItem = event.target.closest('.cart-item');
        cartItem.remove();
        delete cartItems[itemName]; 
    }
    event.stopPropagation(); 
}

minusButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        const itemName = button.closest('.cart-item').getAttribute('data-name');
        if (cartItems[itemName].counter > 1) {
            cartItems[itemName].counter--;
            const counterElement = button.closest('.cart-item').querySelector('.counter');
            counterElement.textContent = cartItems[itemName].counter;
            updateCartItemPrice(itemName, cartItems[itemName].itemPrice, cartItems[itemName].counter); // Обновляем отображаемую цену
        } else {
            const cartItem = button.closest('.cart-item');
            cartItem.remove();
            delete cartItems[itemName]; 
        }
        event.stopPropagation(); 
    });
});


// Обработчик клика на кнопку добавления товара в корзину
addToCartButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const box = button.closest('.box');
        const itemName = box.querySelector('.content h3').textContent;
        const itemPrice = box.querySelector('.content .price').textContent.split('$')[1].split('/')[0].trim();
        const itemImageSrc = box.querySelector('.image img').src;
        addToCart(itemName, itemPrice, itemImageSrc);
    });
});


cartItemContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('fa-times')) {
        const cartItem = event.target.closest('.cart-item');
        const itemName = cartItem.getAttribute('data-name');
        cartItem.remove();
        delete cartItems[itemName]; 
    }
});

function isValidPhoneNumber(phone) {
    return /^\+\d{1,12}$/.test(phone);
}

phoneInput.addEventListener('input', function(event) {
        phoneInput.value = phoneInput.value.replace(/[^\d+]/g, '');
        if (phoneInput.value.charAt(0) !== '+') {
            phoneInput.value = '+' + phoneInput.value;
        }
        if (phoneInput.value.length > 12) {
            phoneInput.value = phoneInput.value.slice(0, 12);
        }
});

form.addEventListener('submit', function(event) {
        const emailInput = document.getElementById('email');
        const phoneNumberInput = document.getElementById('phoneNumber');
        const nameInput = document.getElementById('name');
        const errorMessageEmail = document.getElementById('email-error');
        const errorMessagePhone = document.getElementById('phone-error');
        const errorMessageName = document.getElementById('name-error');

        if (emailInput.value.trim() === '') {
            errorMessageEmail.textContent = 'Enter email';
            event.preventDefault();
        } else {
            errorMessageEmail.textContent = '';
        }

        if (phoneNumberInput.value.trim() === '') {
            errorMessagePhone.textContent = 'Enter phone';
            event.preventDefault();
        } else {
            errorMessagePhone.textContent = '';
        }
        
        if (nameInput.value.trim() === '') {
            errorMessageName.textContent = 'Enter name';
            event.preventDefault();
        } else {
            errorMessageName.textContent = '';
        }

        if (!isValidPhoneNumber(phoneNumberInput.value)) {
            errorMessagePhone.textContent = 'Incorrect phone';
            event.preventDefault();
        }

        if (emailInput.value.trim() !== '' && phoneNumberInput.value.trim() !== '' && nameInput.value.trim() !== '' && isValidPhoneNumber(phoneNumberInput.value)) {
            // All fields are filled and phone number is valid, allow form submission
            form.reset(); // Reset form after successful submission
        } else {
            event.preventDefault();
        }

});


const eyeButtons = document.querySelectorAll('.box .icons .fa-eye');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalCloseButton = document.querySelector('.modal .btn-close');

eyeButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const box = button.closest('.box');
        const itemName = box.querySelector('.content h3').textContent;
        const itemComposition = box.querySelector('.composition').textContent;
        const itemCalories = box.querySelector('.calories').textContent;
        const itemImageSrc = box.querySelector('.image img').src;

        const modalItemName = modal.querySelector('#modal-item-name');
        const modalItemImage = modal.querySelector('#modal-item-image');
        const modalItemComposition = modal.querySelector('#modal-item-composition');
        const modalItemCalories = modal.querySelector('#modal-item-calories');

        modalItemName.textContent = itemName;
        modalItemImage.src = itemImageSrc;
        modalItemComposition.textContent = "Composition: " + itemComposition;
        modalItemCalories.textContent = "Calories: " + itemCalories;

        modal.style.display = 'block';
        overlay.style.display = 'block';
    });
});

modalCloseButton.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
});

overlay.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
});
overlay.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
});

cartItemContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('increment')) {
        const cartItem = event.target.closest('.cart-item');
        const itemName = cartItem.getAttribute('data-name');
        cartItems[itemName].counter++; 
        const quantityElement = cartItem.querySelector('.quantity');
        quantityElement.textContent = cartItems[itemName].counter;
    }
});


cartItemContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('decrement')) {
        const cartItem = event.target.closest('.cart-item');
        const itemName = cartItem.getAttribute('data-name');
        if (cartItems[itemName].counter > 1) {
            cartItems[itemName].counter--; 
            const quantityElement = cartItem.querySelector('.quantity');
            quantityElement.textContent = cartItems[itemName].counter;
        }
    }
});
const searchBox = document.getElementById('search-box'); 

let searchTerm = ''; 

searchBox.addEventListener('input', () => { 
    const newSearchTerm = searchBox.value.trim().toLowerCase(); 
    if (newSearchTerm === searchTerm) return; 
    searchTerm = newSearchTerm; 
    if (searchTerm.length < 4) {
        removeAllHighlights(); 
        return; 
    }
    const regex = new RegExp(searchTerm, 'gi'); 
    const allTextNodes = getTextNodes(document.body); 

    removeAllHighlights(); 

    let found = false; 
    allTextNodes.forEach(node => { 
        const text = node.textContent.toLowerCase(); 
        const match = text.match(regex); 
        if (match) {
            const parentNode = node.parentNode; 
            parentNode.classList.add('highlight');
            scrollToElement(parentNode); 
            found = true; 
        }
    });

    if (!found) {
        alert('Ничего не найдено');
    }
});

function getTextNodes(element) {
    const textNodes = [];
    function getTextNodesRecursively(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            
            if (!node.parentNode.classList.contains('composition')) {
                textNodes.push(node);
            }
        } else {
            node.childNodes.forEach(childNode => {
                getTextNodesRecursively(childNode);
            });
        }
    }
    getTextNodesRecursively(element);
    return textNodes;
}


function scrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeAllHighlights() {
    const highlightedElements = document.querySelectorAll('.highlight'); 
    highlightedElements.forEach(element => { 
        element.classList.remove('highlight'); 
    });
}
let point = document.querySelectorAll('.point')
let imageSlider = document.querySelectorAll('.imageSlider')
let leftBtn = document.getElementById('leftBtn')
let rightBtn = document.getElementById('rightBtn')

point[0].classList.add('activeImage')
imageSlider[0].classList.add('activeImage')

let counter = 0;

for(let i=0; i<point.length; i++){
    point[i].addEventListener('click',()=>{
        for(let k = 0; k<imageSlider.length; k++){
            point[k].classList.remove('activeImage')
            imageSlider[k].classList.remove('activeImage')
        }
        counter = i;
        imageSlider[counter].classList.add('activeImage');
        point[counter].classList.add('activeImage');
    })
}

leftBtn.addEventListener('click',()=>{
    for(let k = 0; k<imageSlider.length; k++){
        point[k].classList.remove('activeImage')
        imageSlider[k].classList.remove('activeImage')
    }
    counter--
    if (counter <0){
        counter = imageSlider.length-1
    }
    imageSlider[counter].classList.add('activeImage');
    point[counter].classList.add('activeImage');
})

rightBtn.addEventListener('click',()=>{
    for(let k = 0; k<imageSlider.length; k++){
        point[k].classList.remove('activeImage')
        imageSlider[k].classList.remove('activeImage')
    }
    counter++
    if (counter >= imageSlider.length){
        counter = 0
    }
    imageSlider[counter].classList.add('activeImage');
    point[counter].classList.add('activeImage');
})


function slowSlider () {
    for(let k = 0; k<imageSlider.length; k++){
        point[k].classList.remove('activeImage')
        imageSlider[k].classList.remove('activeImage')
    }
    counter++
    if (counter >= imageSlider.length){
        counter = 0
    }
    imageSlider[counter].classList.add('activeImage');
    point[counter].classList.add('activeImage');
}

let second = 1000*2
let TimerImage = setInterval(()=>slowSlider(), second)

let blockSlider = document.getElementById('blockSlider')
blockSlider.addEventListener('mouseover',()=>{
    clearInterval(TimerImage)
})

blockSlider.addEventListener('mouseleave',()=>{
    TimerImage = setInterval(()=>slowSlider(), second)
})
});
