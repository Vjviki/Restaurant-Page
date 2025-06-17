import {Link} from 'react-router-dom'
import RestaurantNavbar from '../RestaurantNavBar'
import CreateCartContext from '../../CartContext/CreateCartContext'
import './index.css'

const RestaurantCartPage = () => (
  <CreateCartContext.Consumer>
    {value => {
      const {
        cartList,
        decrementCartItemQuantity,
        incrementCartItemQuantity,
        removeAllCartItems,
        removeItem,
      } = value

      const onClickDesc = dishId => {
        decrementCartItemQuantity(dishId)
      }

      const onClickInc = dishId => {
        incrementCartItemQuantity(dishId)
      }

      const onClickRemoveAllitem = () => {
        removeAllCartItems()
      }

      const onClickRemoveItem = dishId => {
        removeItem(dishId)
      }

      const totalCost =
        cartList.length > 0
          ? cartList.reduce(
              (acc, item) => acc + item.dishPrice * (item.quantity || 1),
              0,
            )
          : '0.00'

      const totalItemsCount = cartList.reduce(
        (acc, item) => acc + (item.quantity || 1),
        0,
      )

      return (
        <>
          <RestaurantNavbar />
          <div className="restaurant-cart-container">
            <div className="restaurant-cart-responsie-container">
              {cartList.length === 0 ? (
                <div className="empty-cart-message">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
                    alt="empty Cart"
                    className="empty-cart-gif"
                  />
                  <p className="funny-subtext">Your cart is Empty</p>
                  <Link to="/">
                    <button type="button" className="cart-menu-button">
                      Home
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="remove-all-button"
                    onClick={onClickRemoveAllitem}
                  >
                    Remove All
                  </button>
                  <ul className="restaurant-cart-list-item">
                    {cartList.map(eachItem => (
                      <li
                        className="restaurant-cart-list"
                        key={eachItem.dishId}
                      >
                        <div className="cart-description-container">
                          <img
                            src={eachItem.dishImage}
                            alt={eachItem.dishName}
                            className="cart-image"
                          />
                          <div className="cart-description">
                            <h1 className="cart-dish-name">
                              {eachItem.dishName}
                            </h1>
                            <p className="cart-dish-price">
                              {`${eachItem.dishCurrency} ${eachItem.dishPrice}`}
                            </p>
                          </div>
                        </div>
                        <div className="inc-dec-container">
                          <div className="cart-inc-des-container">
                            <button
                              className="inc-des-button"
                              type="button"
                              onClick={() => onClickDesc(eachItem.dishId)}
                            >
                              -
                            </button>
                            <p className="cart-count">
                              {eachItem.quantity || 0}
                            </p>
                            <button
                              className="inc-des-button"
                              type="button"
                              onClick={() => onClickInc(eachItem.dishId)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="remove-item"
                            onClick={() => onClickRemoveItem(eachItem.dishId)}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="total-item-container">
                    <h1 className="order-total">
                      Order Total: SAR {totalCost}
                    </h1>
                    <p className="item-count">
                      {totalItemsCount} Item{totalItemsCount > 1 ? 's' : ''} in
                      cart
                    </p>
                    <button
                      className="checkout-button"
                      type="button"
                      aria-label="Proceed to Checkout"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )
    }}
  </CreateCartContext.Consumer>
)

export default RestaurantCartPage
