/* eslint-disable react/prop-types */
import { numberToRupiah } from "../../utils/number-to-rupiah"

export const Product = ({ item: {name, image, price, count, discount} }) => {

    const discountedPrice = discount ? Math.max(0, price - (price * (discount / 100))) : null;

    return (
        <div className="product-detail-item">
            <div className="product">
                <div className="product-image">
                    <img src={image} alt="Product" />
                </div>
                <div className="product-info">
                    <p className="name">{name}</p>
                    {discount > 0 ? (
                        <>
                            <del className="price">{numberToRupiah(price * count)}</del>
                            <p className="price">{numberToRupiah(discountedPrice * count)}</p>
                        </>
                    ) : (
                        <p className="price">{numberToRupiah(price * count)}</p>
                    )}
                </div>
            </div>
            <div>
                <p>{count} item</p>
            </div>
        </div>
    )
}