import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

const Product = ({ product }) => {
  const [loaded, setLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const v = product?._id
  const imageUrl = product?.image ? `${API_BASE_URL}${product.image}` : null

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${v}`}>
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f0f0f0' }}>
          {imageUrl && !imgError ? (
            <>
              {!loaded && (
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              )}
              <img
                src={imageUrl}
                alt={product?.name}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity .3s ease' }}
              />
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No Image</div>
          )}
        </div>
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

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
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
