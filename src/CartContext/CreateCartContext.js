import React from 'react'

const CreateCartContext = React.createContext({
  cartList: [],
  decrementCartItemQuantity: () => {},
  incrementCartItemQuantity: () => {},
  removeAllCartItems: () => {},
  removeItem: () => {},
  addCartItem: () => {},
})

export default CreateCartContext
