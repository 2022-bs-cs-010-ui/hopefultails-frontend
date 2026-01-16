import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

const Product = ({ product }) => {
  const v = product?._id
  const imageUrl = product?.image ? `${API_BASE_URL}${product.image}` : null

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${v}`}>
        <Card.Img src={imageUrl || '/images/sample.jpg'} alt={product?.name} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${v}`}>
          <Card.Title as="div">
            <strong>{product?.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating value={product?.rating || 0} text={`${product?.numReviews || 0} reviews`} color="#f8e825" />
          </div>
        </Card.Text>

        <Card.Text as="h3">${product?.price ?? '0'}</Card.Text>
      </Card.Body>
    </Card>
  )
}

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    numReviews: PropTypes.number,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
}

export default Product
