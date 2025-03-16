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
          <div class="add2cartHover">
              <button type="button">
                <img src="assets/images/icon-decrement-quantity.svg" alt="Add to Cart" />
              </button>
              <input class="input-group-field" type="number" name="quantity" value="0">
              <button type="button" class="button hollow circle" data-quantity="plus" data-field="quantity">
                <img src="assets/images/icon-increment-quantity.svg" alt="Add to Cart" />
              </button>
          </div>
        </div>
        <div class="category">${item.category}</div>
        <div class="item-name">${item.name}</div>
        <div class="price">$${item.price.toFixed(2)}</div>
    </div>`;
  divItems.innerHTML += divItem;
}
