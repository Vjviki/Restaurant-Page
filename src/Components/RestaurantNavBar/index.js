import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoCartOutline} from 'react-icons/io5'
import CreateCartContext from '../../CartContext/CreateCartContext'
import './index.css'

const RestaurantNavBar = props => {
  const {restaurantName} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <CreateCartContext.Consumer>
      {value => {
        const {cartList} = value

        const cartItemBadgeRender = () => (
          <span className="cart-count-badge">{cartList.length}</span>
        )

        return (
          <>
            <nav className="header-container">
              <div className="responsive-header">
                <p className="header-title">{restaurantName}</p>
                <ul className="restaurant-nav-list-item">
                  <li className="menu-list">
                    <Link to="/" className="nav-link">
                      <h1 className="nav-text">Home</h1>
                    </Link>
                  </li>
                  <li className="menu-list">
                    <Link to="/cart" className="nav-link">
                      <h1 className="nav-my-order-text">My Orders</h1>
                      <button
                        type="button"
                        className="cart-icon-button"
                        data-testid="cart"
                      >
                        <IoCartOutline className="cart-icon" />
                        {cartItemBadgeRender()}
                      </button>
                    </Link>
                  </li>
                  <li className="menu-list">
                    <button
                      type="button"
                      className="logout-button"
                      onClick={onClickLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </>
        )
      }}
    </CreateCartContext.Consumer>
  )
}

export default withRouter(RestaurantNavBar)
