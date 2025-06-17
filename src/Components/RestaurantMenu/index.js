import './index.css'

const RestaurantMenu = props => {
  const {categoryOptions, restaurantFoodData, activeMenu} = props
  const categoryMenu = id => {
    categoryOptions(id)
  }
  const activeCategoryId = activeMenu
  return (
    <div className="restaurant-menu-container">
      <div className="restaurant-menu-responsive-container">
        <ul className="restaurant-menu-item">
          {restaurantFoodData[0]?.tableMenuList.map(category => (
            <li key={category.menuCategoryId} className="restaurant-menu-list">
              <button
                type="button"
                value={category.menuCategory}
                className={`menu-button ${
                  activeCategoryId === category.menuCategoryId
                    ? 'active-menu'
                    : ''
                }`}
                onClick={() => categoryMenu(category.menuCategoryId)}
              >
                <span>{category.menuCategory}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RestaurantMenu
