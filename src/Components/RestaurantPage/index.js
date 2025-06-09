import {Component} from 'react'
import RestaurantNavBar from '../RestaurantNavBar'
import RestaurantMenu from '../RestaurantMenu'
import './index.css'

class RestaurantPage extends Component {
  state = {
    foodListData: [],
    foodFilter: [],
    activeMenu: null,
    cartItems: {},
  }

  componentDidMount() {
    this.getFoodlist()
  }

  // Format TableMenu List
  getFormatFoodlist = data => ({
    branchName: data.branch_name,
    nexturl: data.nexturl,
    restaurantId: data.restaurant_id,
    restaurantImage: data.restaurant_image,
    restaurantName: data.restaurant_name,
    tableId: data.table_id,
    tableMenuList: data.table_menu_list.map(eachItem => ({
      categoryDishes: eachItem.category_dishes.map(eachCategory => ({
        addonCat: (eachCategory.addonCat || []).map(eachAddon => ({
          addons: (eachAddon.addons || []).map(eachAddons => ({
            dishAvailability: eachAddons.dish_Availability,
            dishType: eachAddons.dish_Type,
            dishCalories: eachAddons.dish_calories,
            dishCurrency: eachAddons.dish_currency,
            dishDescription: eachAddons.dish_description,
            dishId: eachAddons.dish_id,
            dishImage: eachAddons.dish_image,
            dishName: eachAddons.dish_name,
            dishPrice: eachAddons.dish_price,
          })),
          addonCategory: eachAddon.addon_category,
          addonCategoryId: eachAddon.addon_category_id,
          addonSelection: eachAddon.addon_selection,
        })),
        dishAvailability: eachCategory.dish_Availability,
        dishType: eachCategory.dish_Type,
        dishCalories: eachCategory.dish_calories,
        dishCurrency: eachCategory.dish_currency,
        dishDescription: eachCategory.dish_description,
        dishId: eachCategory.dish_id,
        dishImage: eachCategory.dish_image,
        dishName: eachCategory.dish_name,
        dishPrice: eachCategory.dish_price,
        nexturl: eachCategory.nexturl,
      })),
      menuCategory: eachItem.menu_category,
      menuCategoryId: eachItem.menu_category_id,
      menuCategoryImage: eachItem.menu_category_image,
      nexturl: eachItem.nexturl,
    })),
    tableName: data.table_name,
  })

  // Menu Tab Filter
  categoryOptions = categoryId => {
    const {foodListData} = this.state
    const selectedCategory = foodListData[0].tableMenuList.find(
      eachItem => eachItem.menuCategoryId === categoryId,
    )

    const filteredItem = [
      {
        ...foodListData[0],
        tableMenuList: [selectedCategory],
      },
    ]

    this.setState({
      foodFilter: filteredItem,
      activeMenu: categoryId,
    })
  }

  // Decrement Item
  onClickDesc = dishId => {
    this.setState(prevState => {
      const currentCount = prevState.cartItems[dishId] || 0
      const updatedCount = currentCount > 0 ? currentCount - 1 : 0
      return {
        cartItems: {
          ...prevState.cartItems,
          [dishId]: updatedCount,
        },
      }
    })
  }

  // Increment Item
  onClickInc = dishId => {
    this.setState(prevState => {
      const currentCount = (prevState.cartItems[dishId] || 0) + 1
      return {
        cartItems: {
          ...prevState.cartItems,
          [dishId]: currentCount,
        },
      }
    })
  }

  getFoodlist = async () => {
    const apiUrl =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

    const response = await fetch(apiUrl)
    const data = await response.json()
    const foodDataFormat = data.map(eachMenuList =>
      this.getFormatFoodlist(eachMenuList),
    )

    const initialCartItems = {}

    this.setState({
      foodListData: foodDataFormat,
      activeMenu: foodDataFormat[0].tableMenuList[0].menuCategoryId,
      foodFilter: [
        {
          ...foodDataFormat[0],
          tableMenuList: [foodDataFormat[0].tableMenuList[0]],
        },
      ],
      cartItems: initialCartItems,
    })

    // console.log(data)
  }

  render() {
    const {foodListData, foodFilter, activeMenu, cartItems} = this.state
    const totalCartCount = Object.values(cartItems).reduce(
      (acc, val) => acc + val,
      0,
    )
    const dataToRender = foodFilter.length > 0 ? foodFilter : foodListData
    // console.log(cartItems)
    return (
      <>
        <RestaurantNavBar
          cartCount={totalCartCount}
          categoryFood={foodListData}
        />
        <RestaurantMenu
          categoryFood={foodListData}
          categoryOptions={this.categoryOptions}
          active={activeMenu}
        />
        <div className="restaurant-page-container">
          <div className="responsive-restaurant-page-container">
            <ul className="restaurant-item">
              {dataToRender.map(restaurant =>
                restaurant.tableMenuList.map(menu =>
                  menu.categoryDishes.map(dish => (
                    <li className="restaurant-list-item" key={dish.dishId}>
                      <div className="menu-description-container">
                        <img
                          src="https://res.cloudinary.com/df73pocxs/image/upload/v1749293818/ChatGPT_Image_Jun_7_2025_04_23_37_PM_pxsrhc.png"
                          alt="veg"
                          className="veg-and-nonveg-icon"
                        />
                        <div className="dis-description-container">
                          <h1 className="dis-description-name">
                            {dish.dishName}
                          </h1>
                          <p className="dis-description-price">
                            {`${dish.dishCurrency} ${dish.dishPrice}`}
                          </p>
                          <p className="dis-description">
                            {dish.dishDescription}
                          </p>
                          {dish.dishAvailability ? (
                            <div className="dis-item-add">
                              <button
                                className="inc-des-button"
                                type="button"
                                onClick={() => this.onClickDesc(dish.dishId)}
                              >
                                -
                              </button>
                              <p
                                className="add-item-count"
                                data-testid={`dish-quantity-${dish.dishId}`}
                              >
                                {cartItems[dish.dishId] || 0}
                              </p>
                              <button
                                className="inc-des-button"
                                type="button"
                                onClick={() => this.onClickInc(dish.dishId)}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <h1 className="not-available-item">
                              Not Available
                            </h1>
                          )}
                          {dish.addonCat.length > 0 && (
                            <p className="customizations-text">
                              Customizations available
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="calories-text">
                        {dish.dishCalories} calories
                      </p>
                      <img
                        src={dish.dishImage}
                        alt={dish.dishName}
                        className="food-img"
                      />
                    </li>
                  )),
                ),
              )}
            </ul>
          </div>
        </div>
      </>
    )
  }
}

export default RestaurantPage
