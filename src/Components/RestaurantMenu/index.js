import './index.css'

const RestaurantMenu = props => {
  const {categoryFood, categoryOptions, active} = props
  const categoryMenu = id => {
    categoryOptions(id)
  }

  const activeCategoryId = active
  // console.log(activeCategoryId)
  return (
    <div className="restaurant-menu-container">
      <div className="restaurant-menu-responsive-container">
        <ul className="restaurant-menu-item">
          {categoryFood[0]?.tableMenuList.map(category => (
            <li key={category.menuCategoryId} className="restaurant-menu-list">
              <button
                type="button"
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
