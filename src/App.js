import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import RestaurantLoginPage from './Components/RestaurantLoginPage'
import RestaurantHomePage from './Components/RestaurantHomePage'
import RestaurantCartPage from './Components/RestaurantCartPage'
import NotFound from './Components/NotFound'
import CreateCartContext from './CartContext/CreateCartContext'
import ProtectedRoute from './Components/ProtectedRoute'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  addCartItem = dish => {
    this.setState(prevState => {
      const existingItem = prevState.cartList.find(
        item => item.dishId === dish.dishId,
      )

      if (existingItem) {
        const updatedCart = prevState.cartList.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: (item.quantity || 1) + 1}
            : item,
        )
        return {cartList: updatedCart}
      }

      return {
        cartList: [...prevState.cartList, {...dish, quantity: 1}],
      }
    })
  }

  incrementCartItemQuantity = dishId => {
    this.setState(prevState => {
      const updatedCart = prevState.cartList.map(item =>
        item.dishId === dishId
          ? {...item, quantity: (item.quantity || 1) + 1}
          : item,
      )
      return {cartList: updatedCart}
    })
  }

  decrementCartItemQuantity = dishId => {
    this.setState(prevState => {
      const updatedCart = prevState.cartList
        .map(item => {
          if (item.dishId === dishId) {
            const newQuantity = (item.quantity || 1) - 1
            if (newQuantity > 0) {
              return {...item, quantity: newQuantity}
            }
            return null
          }
          return item
        })
        .filter(item => item !== null)

      return {cartList: updatedCart}
    })
  }

  removeAllCartItems = () => {
    this.setState({cartList: [], cartItemCount: {}})
  }

  removeItem = dishId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.filter(
        eachItem => eachItem.dishId !== dishId,
      ),
    }))

    this.setState(prevState => {
      const updatedCartItemCount = {...prevState.cartItemCount}
      delete updatedCartItemCount[dishId]
      return {
        cartItemCount: updatedCartItemCount,
      }
    })
  }

  render() {
    const {cartList} = this.state
    return (
      <CreateCartContext.Provider
        value={{
          cartList,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          categoryOptions: this.categoryOptions,
          removeAllCartItems: this.removeAllCartItems,
          removeItem: this.removeItem,
          addCartItem: this.addCartItem,
        }}
      >
        <Switch>
          <Route exact path="/login" component={RestaurantLoginPage} />
          <ProtectedRoute exact path="/" component={RestaurantHomePage} />
          <ProtectedRoute exact path="/cart" component={RestaurantCartPage} />
          <Route path="/bad-path" component={NotFound} />
          <Redirect to="/bad-path" />
        </Switch>
      </CreateCartContext.Provider>
    )
  }
}

export default App
