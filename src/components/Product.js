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
  const productName = product?.name || ''
  const displayName = productName
    ? productName.replace(/^(\S+)/, (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase())
    : ''

  const handleHoverEnter = (e) => {
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
  }

  const handleHoverLeave = (e) => {
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
  }

  return (
    <Link to={`/product/${v}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card style={{ marginTop: '12px', marginBottom: '12px', padding: '0', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'row', transition: 'box-shadow 0.3s ease', cursor: 'pointer', height: '220px' }} onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave}>
        {/* Image Section - Left Side */}
        <div style={{ position: 'relative', width: '220px', height: '220px', overflow: 'hidden', background: 'transparent', flexShrink: 0, padding: '12px', boxSizing: 'border-box', borderRadius: '10px' }}>
          {imageUrl && !imgError ? (
            <>
              {!loaded && (
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '8px' }} />
              )}
              <img
                src={imageUrl}
                alt={product?.name}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease', borderRadius: '8px' }}
              />
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '14px', borderRadius: '8px', background: 'transparent', border: '1px dashed #d6d6d6' }}>No Image</div>
          )}
        </div>

        {/* Details Section - Right Side */}
        <Card.Body style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', justifyContent: 'flex-start', gap: '2px' }}>
          <Card.Title as="div" style={{ marginBottom: '8px' }}>
            <strong style={{ fontSize: '22px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{displayName}</strong>
          </Card.Title>

          <Card.Text as="h3" style={{ fontSize: '20px', fontWeight: 'bold', color: '#333333' }}>
            ${product?.price ?? '0'}
          </Card.Text>

          <Card.Text as="h5" style={{ fontSize: '12px', fontWeight: 'bold', color: '#333333', overflow: 'hidden', textOverflow: 'ellipsis', }}>
            {product?.description ?? ''}
          </Card.Text>

          <Card.Text as="div">
            <Rating value={product?.rating || 0} text={`${product?.numReviews || 0}`} color="#f8e825" />
          </Card.Text>
        </Card.Body>

        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      </Card>
    </Link>
  )
}

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    numReviews: PropTypes.number,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
}

export default Product
