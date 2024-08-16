document.addEventListener('DOMContentLoaded', function () {
    const cartBtn = document.getElementById('cartBtn');
    const popup = document.getElementById('cart-popup');
    const closePopup = document.getElementById('close-popup');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const userDetailsForm = document.getElementById('user-details-form');
    const userClosePopup = document.getElementById('close-details-form');
    const bufferingPage = document.getElementById('buffering-page');
    const confirmationPage = document.getElementById('confirmation-page');
    const detailsForm = document.getElementById('detailsForm');
    const confirmationTotalPriceElem = document.getElementById('confirmation-total-price');
    const closeConfirmationPage = document.getElementById('close-confirmation-page');

    let cart = {};
    let totalPrice = 0;

    function toggleVisibility(element, isVisible) {
        element.style.display = isVisible ? 'flex' : 'none';
    }

    async function fetchTickets() {
        try {
            const response = await fetch('/api/tickets');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    }

    async function processPayment(cart, userDetails) {
        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart, userDetails })
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    }

    cartBtn.addEventListener('click', function () {
        toggleVisibility(popup, true);
    });

    closePopup.addEventListener('click', function () {
        toggleVisibility(popup, false);
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const ticketType = this.getAttribute('data-ticket');
            const ticketItem = document.getElementById(ticketType);
            const price = parseFloat(ticketItem.querySelector('.price').textContent.replace('$', ''));
            const quantityControls = ticketItem.querySelector('.quantity-controls');
            const quantityElem = quantityControls.querySelector('.quantity');

            this.style.display = 'none';
            quantityControls.style.display = 'flex';
            quantityElem.textContent = 1;

            updateCart(ticketType, 1, price);
        });
    });

    document.querySelectorAll('.quantity-button').forEach(button => {
        button.addEventListener('click', function () {
            const ticketItem = this.closest('.ticket-item');
            const ticketType = ticketItem.id;
            const price = parseFloat(ticketItem.querySelector('.price').textContent.replace('$', ''));
            const quantityElem = ticketItem.querySelector('.quantity');
            let quantity = parseInt(quantityElem.textContent);

            if (this.getAttribute('data-action') === 'increase') {
                quantity += 1;
            } else if (this.getAttribute('data-action') === 'decrease' && quantity > 1) {
                quantity -= 1;
            } else if (this.getAttribute('data-action') === 'decrease' && quantity === 1) {
                quantity = 0;
                ticketItem.querySelector('.add-to-cart').style.display = 'inline-block';
                ticketItem.querySelector('.quantity-controls').style.display = 'none';
            }

            quantityElem.textContent = quantity;
            updateCart(ticketType, quantity, price);
        });
    });

    function updateCart(ticketType, quantity, price) {
        if (quantity > 0) {
            cart[ticketType] = {
                quantity: quantity,
                price: price,
                total: quantity * price
            };
        } else {
            delete cart[ticketType];
        }

        renderCart();
    }

    function renderCart() {
        cartItems.innerHTML = '';
        totalPrice = 0;

        for (let ticketType in cart) {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <span class="ticket-name">${ticketType.replace('-', ' ')}</span>
                <div class="ticket-details">Quantity: ${cart[ticketType].quantity}</div>
                <div class="ticket-details">Total: $${cart[ticketType].total.toFixed(2)}</div>
                <button class="delete-btn" data-ticket="${ticketType}">Delete</button>
            `;

            cartItems.appendChild(cartItem);
            totalPrice += cart[ticketType].total;
        }

        totalPriceElem.textContent = totalPrice.toFixed(2);
    }

    cartItems.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('delete-btn')) {
            const ticketType = event.target.getAttribute('data-ticket');
            const ticketItem = document.getElementById(ticketType);
            const quantityControls = ticketItem.querySelector('.quantity-controls');

            updateCart(ticketType, 0, 0);

            ticketItem.querySelector('.add-to-cart').style.display = 'inline-block';
            quantityControls.style.display = 'none';
        }
    });

    checkoutBtn.addEventListener('click', function () {
        toggleVisibility(popup, false);
        toggleVisibility(userDetailsForm, true);
        confirmationTotalPriceElem.textContent = totalPrice.toFixed(2);
    });

    userClosePopup.addEventListener('click', function () {
        toggleVisibility(userDetailsForm, false);
    });

    detailsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        toggleVisibility(userDetailsForm, false);
        toggleVisibility(bufferingPage, true);

        const userDetails = {
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            payment: document.getElementById('payment').value
        };

        // Simulate processing time
        setTimeout(async () => {
            const result = await processPayment(cart, userDetails);
            toggleVisibility(bufferingPage, false);
            toggleVisibility(confirmationPage, true);

            if (result.success) {
                confirmationTotalPriceElem.textContent = totalPrice.toFixed(2);
            }
        }, 2000); // Simulate a 2-second buffering time
    });

    closeConfirmationPage.addEventListener('click', function () {
        toggleVisibility(confirmationPage, false);
        resetCart();
    });

    function resetCart() {
        cart = {};
        totalPrice = 0;
        renderCart();
        document.querySelectorAll('.quantity-controls').forEach(controls => controls.style.display = 'none');
        document.querySelectorAll('.add-to-cart').forEach(button => button.style.display = 'inline-block');
    }
});
