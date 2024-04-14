document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('header .navbar'); 

    function toggleActiveElements(activeElement) {
        const searchForm = document.querySelector('.search-form');
        [navbar, cartItemContainer, searchForm].forEach(element => {
            if (element !== activeElement) {
                element.classList.remove('active');
            }
        });
    }

    document.querySelector('#menu-btn').addEventListener('click', () => {
        navbar.classList.toggle('active');
        toggleActiveElements(navbar);
    });

    window.addEventListener('scroll', () => {
        toggleActiveElements(null);
    });


    document.getElementById("card-number").addEventListener("input", function() {
        this.value = this.value.replace(/[^\d]/, '');
        if (this.value.length > 12) {
            this.value = this.value.slice(0, 12); 
        }
    });
    
    document.getElementById("expire-day").addEventListener("input", function() {
        this.value = this.value.replace(/[^\d]/g, ''); 
        if (parseInt(this.value) < 1 || parseInt(this.value) > 31) {
            this.value = ''; 
        }
    });
    
    document.getElementById("expire-month").addEventListener("input", function() {
        this.value = this.value.replace(/[^\d]/g, ''); 
        if (parseInt(this.value) < 1 || parseInt(this.value) > 12) {
            this.value = ''; 
        }
    });
    
    document.getElementById("cvv").addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, ''); 
        if (this.value.length > 3) {
            this.value = this.value.slice(0, 3); 
        }
    });
    
    document.getElementById("cardholder-name").addEventListener("input", function() {
        this.value = this.value.toUpperCase(); 
        this.value = this.value.replace(/[^A-Za-z ]/g, ''); 
    });
    
    const paymentForm = document.querySelector('form');
const payButton = document.querySelector('.btn-primary');
const cardholderNameInput = document.getElementById('cardholder-name');
const cardNumberInput = document.getElementById('card-number');
const expirationDateInputs = document.querySelectorAll('.expire-date input');
const cvvInput = document.getElementById('cvv');

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

payButton.addEventListener('click', (event) => {
    event.preventDefault();
    let isAnyFieldEmpty = false;

    if (cardholderNameInput.value.trim() === '') {
        isAnyFieldEmpty = true;
    }

    if (cardNumberInput.value.trim() === '' || cardNumberInput.value.trim().length !== 12) {
        isAnyFieldEmpty = true;
    }

    expirationDateInputs.forEach(input => {
        if (input.value.trim() === '') {
            isAnyFieldEmpty = true;
        }
    });

    if (cvvInput.value.trim() === '' || cvvInput.value.trim().length !== 3) {
        isAnyFieldEmpty = true;
    }

    if (isAnyFieldEmpty) {
        alert('Please fill in all fields correctly');
        return;
    }

    let isExpirationDateValid = true;
    expirationDateInputs.forEach(input => {
        if (input.value.trim() === '') {
            isExpirationDateValid = false;
            return;
        }
    });

    if (!isExpirationDateValid) {
        alert('Please fill in all fields correctly');
        return;
    }

    paymentForm.reset();
    localStorage.removeItem('cart');
    localStorage.removeItem('totalPrice');
});

    
    
    
});
