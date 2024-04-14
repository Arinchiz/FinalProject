document.addEventListener("DOMContentLoaded", function() {
    var cartIcons = document.querySelectorAll(".fas.fa-shopping-cart");
    cartIcons.forEach(function(icon) {
        icon.addEventListener("click", function() {
            addCartClicked(icon);
        });
    });
    window.addEventListener('load', () => {
        let savedCart = localStorage.getItem('cart');
        if (savedCart) {
            document.querySelector(".cart-content").innerHTML = savedCart;
            updatetotal();
        }
    });


    let cartIcon = document.querySelector("#cart-icon");
    let cart = document.querySelector(".cart");
    let closeCart = document.querySelector("#close-cart");

    cartIcon.addEventListener("click", () => { 
        cart.classList.add("active");
    });

    closeCart.addEventListener("click", () => { 
        cart.classList.remove("active");
    });

    if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", ready);
    } else {
        ready();
    }


        function ready() {
            var removeCartButtons = document.getElementsByClassName('cart-remove');
            for (var i = 0; i < removeCartButtons.length; i++) {
                var button = removeCartButtons[i];
                button.addEventListener('click', removeCartItem);
            }
            var quantityInputs = document.getElementsByClassName("cart-quantity");
            for (var i = 0; i < quantityInputs.length; i++) {
                var input = quantityInputs[i];
                input.addEventListener("change", quantityChanged);
            }
            var addCart = document.getElementsByClassName("add-cart")
            for (var i = 0; i < addCart.length; i++) {
                var button = addCart[i];
                button.addEventListener("click", addCartClicked);
            }
            document.getElementsByClassName("btn-buy")[0].addEventListener('click', buyButtonClicked);
        }
    

    function buyButtonClicked() {
        window.location.href = 'order.html';
    }

    var addCartButtons = document.querySelectorAll('.fas.fa-shopping-cart');
    for (var i = 0; i < addCartButtons.length; i++) {
        addCartButtons[i].addEventListener('click', addCartClicked);
    }

    function addCartClicked(event) {
        var button = event.target;
        var shopProducts = button.closest(".product-box");
        var title = shopProducts.querySelector(".product-title").innerText;
        var priceElement = shopProducts.querySelector(".price");
        var price = priceElement.childNodes[0].nodeValue.trim();
        var productImg = shopProducts.querySelector(".product-img").src;

        var cartItemsNames = document.querySelectorAll(".cart-product-title");
        for (var i = 0; i < cartItemsNames.length; i++) {
            if (cartItemsNames[i].innerText === title) {
                var quantityInput = cartItemsNames[i].parentElement.querySelector(".cart-quantity");
                quantityInput.value = parseInt(quantityInput.value) + 1; 
                updatetotal();
                cart.classList.add("active"); 
                return; 
            }
        }

        addProductToCart(title, price, productImg);
        updatetotal();
    }

    function addProductToCart(title, price, productImg) {
        console.log("Adding product to cart:", title, price);

        var cartContent = document.querySelector(".cart-content");
        console.log("Cart content:", cartContent);

        var cartBoxes = cartContent.querySelectorAll(".cart-box");
        console.log("Cart boxes:", cartBoxes);

        var cartItemsNames = cartContent.querySelectorAll(".cart-product-title");
        console.log("Cart item names:", cartItemsNames);

        for (var i = 0; i < cartItemsNames.length; i++) {
            if (cartItemsNames[i].innerText === title) {
                var quantityInput = cartBoxes[i].querySelector(".cart-quantity");
                quantityInput.value = parseInt(quantityInput.value) + 1; 
                updatetotal();
                cart.classList.add("active"); 
                return; 
            }
        }

        var cartShopBox = document.createElement("div");
        cartShopBox.classList.add("cart-box");

        var cartBoxContent = `
            <img src="${productImg}" alt="" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">${price}</div>
                <input type="number" value="1" class="cart-quantity">
            </div>
            <i class='bx bxs-trash-alt cart-remove'></i>
        `;
        cartShopBox.innerHTML = cartBoxContent;
        cartContent.appendChild(cartShopBox);
        cartShopBox.querySelector(".cart-remove").addEventListener('click', removeCartItem);
        cartShopBox.querySelector(".cart-quantity").addEventListener('change', quantityChanged);

        updatetotal(); 
        cart.classList.add("active"); 
    }

    function removeCartItem(event) {
        var buttonClicked = event.target;
        buttonClicked.parentElement.remove();
        updatetotal();
    }

    function quantityChanged(event) {
        var input = event.target;
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
        }
        updatetotal();

    }

    function updatetotal() {
        var cartContent = document.getElementsByClassName("cart-content")[0];
        var cartBoxes = cartContent.getElementsByClassName("cart-box");
        var total = 0;

        if (cartBoxes.length === 0) { 
            total = 0;
        } else {
            for (var i = 0; i < cartBoxes.length; i++) {
                var cartBox = cartBoxes[i];
                var priceElement = cartBox.getElementsByClassName("cart-price")[0];
                var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
                var price = parseFloat(priceElement.innerText.replace("$", ""));
                var quantity = quantityElement.value;
                total += price * quantity;
            }
        }

        total = Math.round(total * 100) / 100;
        document.getElementsByClassName("total-price")[0].innerText = "$" + total;
        localStorage.setItem('cart', document.querySelector(".cart-content").innerHTML);
    }

    const eyeButtons = document.querySelectorAll('.product-box .icons .fa-eye');
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    const modalCloseButton = document.querySelector('.modal .btn-close');

    eyeButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const box = button.closest('.product-box');
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

    
});
