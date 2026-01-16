import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

const Product = ({ product }) => {
  const v = product._id
  const imageUrl = product.image ? `${API_BASE_URL}${product.image}` : null

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${v}`}>
        {imageUrl ? (
          <Card.Img src={imageUrl} alt={product.name} />
        ) : (
          <div style={{ height: '200px', background: '#f0f0f0' }} />
        )}
      </Link>

      <Card.Body>
        <Link to={`/product/${v}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
              color="yellow"
            />
          </div>
        </Card.Text>

        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product

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
