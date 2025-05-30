import items from "./data.js";

let cart = []
let divItems = document.querySelector(".items");

for (let item of items) {
  let index = items.indexOf(item);
  let divItem = `
    <div class="item">
        <div class="item-image">
          <img class="desktop" src="${item.image.desktop}">
          <img class="tablet" src="${item.image.tablet}">
          <img class="mobile" src="${item.image.mobile}">
          <button class="add2cart">
              <img src="assets/images/icon-add-to-cart.svg" alt="Add to Cart" class="cart-image" />  
              <span>Add to Cart</span>
          </button>
          <div class="add2cartButtons" data-item="${index}">
              <button type="button" class="minus">
                <div class="icon-quantity"><img src="assets/images/icon-decrement-quantity.svg" alt="Add to Cart" /></div>
              </button>
              <input type="number" id="quantity" min="0" step="1" value="1" disabled>
              <button type="button" class="plus">
                <div class="icon-quantity"><img src="assets/images/icon-increment-quantity.svg" alt="Add to Cart" /></div>
              </button>
          </div>
        </div>
        <div class="category">${item.category}</div>
        <div class="item-name">${item.name}</div>
        <div class="price">$${item.price.toFixed(2)}</div>
    </div>`;
  divItems.innerHTML += divItem;
}

let add2cart = document.querySelectorAll(".add2cart");
for (let element of add2cart) {
  element.addEventListener("click", function () {
    let add2cartButtons = this.nextElementSibling
    add2cartButtons.style.visibility = "visible"
    let itemIndex = add2cartButtons.getAttribute("data-item")
    let quantity = add2cartButtons.querySelector("#quantity")
    let item = items[itemIndex]
    quantity.value = 1
    let added = {
      id: itemIndex,
      name: item.name,
      price: item.price,
      quantity: parseInt(quantity.value),
      image: item.image
    }

    cart.push(added)

    this.parentElement.classList.add("active")
    updateCart(true)
  })
}

let minus = document.querySelectorAll(".minus")
for (let e of minus) {
  let itemIndex = e.parentElement.getAttribute("data-item")
  let item = items[itemIndex]

  e.nextElementSibling.nextElementSibling.addEventListener("click", function () {
    e.nextElementSibling.stepUp(1)
    cart = cart.map(e => {
      if (e.name == item.name) {
        e.quantity += 1
      }
      return e
    })
    updateCart()
  })

  e.addEventListener("click", function () {
    e.nextElementSibling.stepDown(1)
    cart = cart.map(e => {
      if (e.name == item.name) {
        e.quantity -= 1
      }
      return e
    })
    if (e.nextElementSibling.value == 0) {
      cart = cart.filter(e => e.name != item.name)
      document.querySelector(`.cart-item[data-item="${itemIndex}"]`).classList.add("hidden")
      this.parentElement.parentElement.classList.remove("active")
      this.parentElement.style.visibility = "hidden"
    }
    setTimeout(() => {
      updateCart()
    }, 250);
  })
}

function updateTotal(element) {
  let totalPrice = document.querySelector(element)
  let total = cart.reduce(
    (acc, value) => acc + (value.quantity * value.price), 0
  );
  totalPrice.textContent = `$${total.toFixed(2)}`
}

function updateCart(add = false) {
  let cartCount = document.querySelector(".cart-item-count")
  let sommeItems = cart.reduce(
    (acc, value) => acc + value.quantity, 0
  );
  cartCount.textContent = sommeItems

  let emptyCart = document.querySelector(".empty-cart")
  let loadedCart = document.querySelector(".loaded-cart")
  emptyCart.style.display = cart.length > 0 ? "none" : "block"
  loadedCart.style.display = cart.length > 0 ? "block" : "none"
  let cartItems = document.querySelector(".cart-items")
  cartItems.innerHTML = ""
  for (let item of cart) {
    let index = cart.indexOf(item)
    cartItems.innerHTML += `
      <div class="cart-item ${(index + 1) < cart.length ? "visible" : ""}" data-item="${item.id}">
        <div>
          <p class="cart-item-name">${item.name}</p>
          <p>
            <span class="cart-item-quantity">${item.quantity}x</span>
            <span class="cart-item-price">@ $${item.price.toFixed(2)}</span> 
            <span class="cart-item-total">$${(item.quantity * item.price).toFixed(2)}</span>
          </p>
        </div>
        <button type="button" class="cart-item-remove">
          <div class="icon-quantity"><img src="assets/images/icon-remove-item.svg" alt="Remove Item" /></div>
        </button>
      </div>
    `
    if (add) {
      setTimeout(() => {
        document.querySelector(".cart-item:last-child").classList.add("animate")
        document.querySelector(".cart-item:last-child").classList.add("visible")
      }, 200);
    } else {
      document.querySelector(".cart-item:last-child").classList.add("visible")
    }

    updateTotal(".total-price")

    let removeBtns = document.querySelectorAll(".cart-item-remove")
    for (const btn of removeBtns) {
      btn.addEventListener("click", function () {
        let index = this.parentElement.getAttribute("data-item")
        cart = cart.filter(e => e.id != index)
        this.parentElement.classList.add("hidden")
        setTimeout(() => {
          updateCart()
        }, 300);
        let itemButtons = document.querySelector(`.add2cartButtons[data-item="${index}"]`)
        itemButtons.parentElement.classList.remove("active")
        itemButtons.style.visibility = "hidden"
      })
    }
  }
}

let confirmOrderBtn = document.querySelector(".confirm-order")
confirmOrderBtn.addEventListener("click", () => confirmOrder())

function confirmOrder() {
  let orderItems = document.querySelector(".order-items")
  orderItems.innerHTML = ""
  for (let item of cart) {
    orderItems.innerHTML += `
      <div class="order-item">
        <img class="order-item-image" src="${item.image.thumbnail}" alt="${item.name}" />
        <div>
          <p class="order-item-name">${item.name}</p>
          <p><span class="cart-item-quantity">${item.quantity}x</span><span class="cart-item-price">@ $${item.price.toFixed(2)}</span></p>
        </div>
        <p class="order-item-total">$${(item.quantity * item.price).toFixed(2)}</p>
      </div>
    `
  }

  updateTotal(".order-summary .total-price")

  let confirmBackground = document.querySelector(".confirm-background")
  let orderConfirmed = document.querySelector(".order-confirmed")
  confirmBackground.style.visibility = "visible"
  orderConfirmed.style.transform = "scale(1, 1)"
}

let newOrderBtn = document.querySelector(".start-order")
newOrderBtn.addEventListener("click", startNewOrder)

function startNewOrder() {
  cart = []
  updateCart()
  let confirmBackground = document.querySelector(".confirm-background")
  confirmBackground.style.visibility = "hidden"
  let items = document.querySelectorAll(".item-image.active")
  for (const item of items) {
    item.classList.remove("active")
    item.querySelector(".add2cartButtons").style.visibility = "hidden"
  }
}