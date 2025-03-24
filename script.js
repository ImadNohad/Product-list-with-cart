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
    updateCart(cart)
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
    updateCart(cart)
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
      this.parentElement.parentElement.classList.remove("active")
      this.parentElement.style.visibility = "hidden"
    }
    updateCart(cart)
  })
}

function updateTotal(cart, element) {
  let totalPrice = document.querySelector(element)
  let total = cart.reduce(
    (acc, value) => acc + (value.quantity * value.price), 0
  );
  totalPrice.textContent = `$${total.toFixed(2)}`
}

function updateCart(cart) {
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
    cartItems.innerHTML += `
      <div class="cart-item" data-cart-item="${cart.indexOf(item)}">
        <div>
          <p class="cart-item-name">${item.name}</p>
          <p><span class="cart-item-quantity">${item.quantity}x</span><span class="cart-item-price">@ $${item.price.toFixed(2)}</span> <span class="cart-item-total">$${(item.quantity * item.price).toFixed(2)}</span></p>
        </div>
        <button type="button" data-item="${item.id}" class="cart-item-remove">
          <div class="icon-quantity"><img src="assets/images/icon-remove-item.svg" alt="Remove Item" /></div>
        </button>
      </div>
    `
    updateTotal(cart, ".total-price")

    let removeBtns = document.querySelectorAll(".cart-item-remove")
    for (const btn of removeBtns) {
      btn.addEventListener("click", function () {
        let index = this.getAttribute("data-item")
        cart = cart.filter(e => e.id != index)
        this.parentElement.remove()
        let itemButtons = document.querySelector(`.add2cartButtons[data-item="${index}"]`)
        itemButtons.parentElement.classList.remove("active")
        itemButtons.style.visibility = "hidden"
        updateCart(cart)
      })
    }
  }
}

// function updateCart(cartItem = {}, remove = false) {
//   let cartCount = document.querySelector(".cart-item-count")
//   let sommeItems = cart.reduce(
//     (acc, value) => acc + value.quantity, 0
//   );
//   cartCount.textContent = sommeItems

//   let cartItems = document.querySelector(".cart-items")
//   let newItem = document.createElement("div")
//   newItem.setAttribute("data-item", cartItem.id)
//   newItem.setAttribute("data-cart-item", cart.indexOf(cartItem))
//   newItem.className = "cart-item"
//   newItem.innerHTML = `
//       <div>
//         <p class="cart-item-name">${cartItem.name}</p>
//         <p><span class="cart-item-quantity">${cartItem.quantity}x</span><span class="cart-item-price">@ $${cartItem.price?.toFixed(2)}</span> <span class="cart-item-total">$${(cartItem.quantity * cartItem.price).toFixed(2)}</span></p>
//       </div>
//       <button type="button" class="cart-item-remove">
//         <div class="icon-quantity"><img src="assets/images/icon-remove-item.svg" alt="Remove Item" /></div>
//       </button>
//   `

//   let found = cart.findIndex(x => x.id == cartItem.id)
//   if (found != -1) {
//     let oldItem = cartItems.querySelector(`div[data-item="${cartItem.id}"]`)
//     cartItems.replaceChild(newItem, oldItem)
//   } else {
//     if (!remove) {
//       cartItems.appendChild(newItem)

//       setTimeout(() => {
//         newItem.classList.add("slide")
//       }, 100);
//     }
//   }

//   let emptyCart = document.querySelector(".empty-cart")
//   let loadedCart = document.querySelector(".loaded-cart")
//   emptyCart.style.display = cartItems.innerHTML.trim() != "" ? "none" : "block"
//   loadedCart.style.display = cartItems.innerHTML.trim() != "" ? "block" : "none"

//   // cartItems.innerHTML = ""
//   // for (let item of cart) {
//   //   cartItems.innerHTML += `
//   //     <div class="cart-item" data-item="${item.id}" data-cart-item="${cart.indexOf(item)}">
//   //       <div>
//   //         <p class="cart-item-name">${item.name}</p>
//   //         <p><span class="cart-item-quantity">${item.quantity}x</span><span class="cart-item-price">@ $${item.price.toFixed(2)}</span> <span class="cart-item-total">$${(item.quantity * item.price).toFixed(2)}</span></p>
//   //       </div>
//   //       <button type="button" class="cart-item-remove">
//   //         <div class="icon-quantity"><img src="assets/images/icon-remove-item.svg" alt="Remove Item" /></div>
//   //       </button>
//   //     </div>
//   //   `
//   updateTotal(cart, ".total-price")
//   // }

//   let removeBtns = document.querySelectorAll(".cart-item-remove")
//   for (const btn of removeBtns) {
//     btn.addEventListener("click", function () {
//       // let cartIndex = this.parentElement.getAttribute("data-cart-item")
//       let index = this.parentElement.getAttribute("data-item")
//       cart = cart.filter(e => e.name != cartItem.name)
//       // cart.splice(cartIndex, 1)
//       this.parentElement.remove()
//       let itemButtons = document.querySelector(`.add2cartButtons[data-item="${index}"]`)
//       itemButtons.parentElement.classList.remove("active")
//       itemButtons.style.visibility = "hidden"
//       updateCart()
//     })
//   }
// }

let confirmOrderBtn = document.querySelector(".confirm-order")
confirmOrderBtn.addEventListener("click", () => confirmOrder(cart))

function confirmOrder(cart) {
  let orderItems = document.querySelector(".order-items")
  orderItems.innerHTML = ""
  for (let item of cart) {
    orderItems.innerHTML += `
      <div class="order-item" data-cart-item="${cart.indexOf(item)}">
        <img class="order-item-image" src="${item.image.thumbnail}" alt="${item.name}" />
        <div>
          <p class="order-item-name">${item.name}</p>
          <p><span class="cart-item-quantity">${item.quantity}x</span><span class="cart-item-price">@ $${item.price.toFixed(2)}</span></p>
        </div>
        <p class="order-item-total">$${(item.quantity * item.price).toFixed(2)}</p>
      </div>
    `
  }

  updateTotal(cart, ".order-summary .total-price")

  let confirmBackground = document.querySelector(".confirm-background")
  confirmBackground.style.visibility = "visible"
}

let newOrderBtn = document.querySelector(".start-order")
newOrderBtn.addEventListener("click", startNewOrder)

function startNewOrder() {
  cart = []
  updateCart(cart)
  let confirmBackground = document.querySelector(".confirm-background")
  confirmBackground.style.visibility = "hidden"
  let items = document.querySelectorAll(".item-image.active")
  for (const item of items) {
    item.classList.remove("active")
    item.querySelector(".add2cartButtons").style.visibility = "hidden"
  }
}