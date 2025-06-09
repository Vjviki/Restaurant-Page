import {Link} from 'react-router-dom'
import {IoCartOutline} from 'react-icons/io5'
import './index.css'

const RestaurantNavBar = props => {
  const {categoryFood} = props
  const cartItemBadgeRender = () => {
    const {cartCount} = props
    return <span className="cart-count-badge">{cartCount}</span>
  }
  return (
    <nav className="header-container">
      <div className="responsive-header">
        <h1 className="header-title">{categoryFood[0]?.restaurantName}</h1>
        <Link to="/cart" className="nav-link">
          <h1 className="nav-my-order-text">My Orders</h1>
          <div className="cart-icon-container">
            <IoCartOutline className="cart-icon" />
            {cartItemBadgeRender()}
          </div>
        </Link>
      </div>
    </nav>
  )
}

export default RestaurantNavBar
