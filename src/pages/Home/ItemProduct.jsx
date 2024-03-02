import { useState } from "react"
import { Button } from "../../components/Button"
import { Counter } from "../../components/Counter"
import { numberToRupiah } from "../../utils/number-to-rupiah"

export const ItemProduct = ({ name, deskripsi, price, image, discount, discount_name, stock, onProductChange, defaultCount }) => {
    const [count, setCount] = useState(defaultCount)

    const handleCountChange = (value) => {
      setCount(value)
      if(onProductChange) onProductChange(value)
    }

    const discountedPrice = discount ? Math.max(0, price - (price * (discount / 100))) : null;

    return (
      <div className='item-product'>
        <div>
          <img className='image-product' src={image} alt={name} />
          <div className='info-product'>
            <p className={'name-product'}>{stock === 'Kosong' ? <del>{name}</del> : name}</p>
            <p className='deskripsi-product'>{deskripsi}</p>
            {discount ? <p className='deskripsi-product'>{discount_name} Discount {discount}%</p> : null}
            <p className='price-product'>
              {discount ? (
                <>
                  <del>{numberToRupiah(price)}</del> <br />
                  {numberToRupiah(discountedPrice)} 
                </>
              ) : (
                numberToRupiah(price)
              )}
            </p> 
          </div>
        </div>
        <div>
          {stock !== 'Kosong' ? (
            count > 0 ? <Counter defaultValue={count} onValueChange={handleCountChange} /> : <Button onClick={() => handleCountChange(1)}>Add</Button>
          ) : (
            <Button disabled>Out of Stock</Button>
          )}
        </div>
      </div>
    )
}