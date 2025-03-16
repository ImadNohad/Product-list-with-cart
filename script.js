import items from "./data.js";

let divItems = document.querySelector(".items");
for (let item of items) {
  let index = items.indexOf(item);
  let divItem = `
    <div class="item item-${index}">
        <div class="item-image">
          <img src="${item.image.desktop}">
          <div class="add2cart">
              <img src="assets/images/icon-add-to-cart.svg" alt="Add to Cart" class="cart-image" />
              <span>Add to Cart</span>
          </div>
          <div class="add2cartButtons">
              <button type="button">
                <div class="icon-quantity"><img src="assets/images/icon-decrement-quantity.svg" alt="Add to Cart" /></div>
              </button>
              <input class="input-group-field" type="text" name="quantity" value="1" disabled>
              <button type="button" class="button hollow circle" data-quantity="plus" data-field="quantity">
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
