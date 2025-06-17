import {Component} from 'react'
import Loader from 'react-loader-spinner'
import RestaurantMenu from '../RestaurantMenu'
import RestaurantNavBar from '../RestaurantNavBar'
import CreateCartContext from '../../CartContext/CreateCartContext'
import './index.css'

const state = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class RestaurantHomePage extends Component {
  state = {
    restaurantFoodData: [],
    foodFilter: [],
    activeMenu: null,
    cartItemCount: {},
    status: state.initial,
    restaurantName: '',
  }

  componentDidMount() {
    this.getFoodlist()
  }

  getFormatFoodlist = data => ({
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
  })

  getFoodlist = async () => {
    this.setState({status: state.inProgress})
    const apiUrl =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const foodDataFormat = data.map(eachMenuList =>
        this.getFormatFoodlist(eachMenuList),
      )

      const initialCartItems = {}

      this.setState({
        restaurantFoodData: foodDataFormat,
        restaurantName: data[0].restaurant_name,
        activeMenu: foodDataFormat[0].tableMenuList[0].menuCategoryId,
        foodFilter: [
          {
            ...foodDataFormat[0],
            tableMenuList: [foodDataFormat[0].tableMenuList[0]],
          },
        ],
        cartItemCount: initialCartItems,
        status: state.success,
      })
      console.log(data)
    } else {
      this.setState({status: state.failure})
    }
  }

  categoryOptions = categoryId => {
    const {restaurantFoodData} = this.state
    const selectedCategory = restaurantFoodData[0].tableMenuList.find(
      eachItem => eachItem.menuCategoryId === categoryId,
    )

    const filteredItem = [
      {
        ...restaurantFoodData[0],
        tableMenuList: [selectedCategory],
      },
    ]

    this.setState({
      foodFilter: filteredItem,
      activeMenu: categoryId,
    })
  }

  onClickDesc = dishId => {
    this.setState(prevState => {
      const prevCount = prevState.cartItemCount[dishId] || 0
      if (prevCount === 0) {
        return null
      }
      return {
        cartItemCount: {
          ...prevState.cartItemCount,
          [dishId]: prevCount - 1,
        },
      }
    })
  }

  onClickInc = dishId => {
    this.setState(prevState => {
      const prevCount = prevState.cartItemCount[dishId] || 0
      return {
        cartItemCount: {
          ...prevState.cartItemCount,
          [dishId]: prevCount + 1,
        },
      }
    })
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="TailSpin" width={180} height={50} color="blue" />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="failureImage"
        className="failure-img"
      />
      <h1 className="failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderSuccessItem = () => {
    const {foodFilter, cartItemCount, restaurantFoodData} = this.state
    return (
      <CreateCartContext.Consumer>
        {value => {
          const {addCartItem} = value

          const onClickAddToCat = dish => {
            addCartItem(dish)
          }

          const dataToRender =
            foodFilter.length > 0 ? foodFilter : restaurantFoodData
          return (
            <>
              <ul className="restaurant-item">
                {dataToRender.map(restaurant =>
                  restaurant.tableMenuList.map(menu =>
                    menu.categoryDishes.map(dish => (
                      <li className="restaurant-list-item" key={dish.dishId}>
                        <div className="menu-description-container">
                          <img
                            src={
                              dish.dishType % 2 === 0
                                ? 'https://res.cloudinary.com/df73pocxs/image/upload/v1749293818/ChatGPT_Image_Jun_7_2025_04_23_37_PM_pxsrhc.png'
                                : 'https://res.cloudinary.com/df73pocxs/image/upload/v1749293829/ChatGPT_Image_non_veg_Jun_7_2025_04_23_37_PM_sgs59b.png'
                            }
                            alt={dish.dishType % 2 === 0 ? 'veg' : 'nonveg'}
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
                                  {cartItemCount[dish.dishId] || 0}
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
                              <button
                                className="customizations-button"
                                type="button"
                              >
                                Customizations available
                              </button>
                            )}
                            {cartItemCount[dish.dishId] > 0 && (
                              <button
                                className="add-to-cart-button"
                                type="button"
                                onClick={() => onClickAddToCat(dish)}
                              >
                                ADD TO CART
                              </button>
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
            </>
          )
        }}
      </CreateCartContext.Consumer>
    )
  }

  renderAllItem = () => {
    const {status} = this.state
    switch (status) {
      case state.inProgress:
        return this.renderLoader()
      case state.success:
        return this.renderSuccessItem()
      case state.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {restaurantFoodData, activeMenu, restaurantName} = this.state
    return (
      <>
        <RestaurantNavBar restaurantName={restaurantName} />
        <RestaurantMenu
          categoryOptions={this.categoryOptions}
          restaurantFoodData={restaurantFoodData}
          activeMenu={activeMenu}
        />
        <div className="restaurant-page-container">
          <div className="responsive-restaurant-page-container">
            {this.renderAllItem()}
          </div>
        </div>
      </>
    )
  }
}
export default RestaurantHomePage
