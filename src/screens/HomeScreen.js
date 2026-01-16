import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import ErrorBoundary from '../components/ErrorBoundary'
import { API_ENDPOINTS } from '../config/api'
import axios from 'axios'

const HomeScreen = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await axios.get(API_ENDPOINTS.PRODUCTS)
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.detail || err?.message || 'Failed to load products')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchProducts()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <ErrorBoundary>
      <div>
        <Row>
          <Col md={10}>
            <h1>LATEST PRODUCTS</h1>
            {error && <Message variant="danger">{error}</Message>}
            {loading ? (
              <Loader />
            ) : products.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {products.map((val) => (
                  <div key={val?._id || Math.random()} style={{ width: '100%' }}>
                    {val ? <Product product={val} /> : null}
                  </div>
                ))}
              </div>
            ) : (
              <Message variant="info">No products available.</Message>
            )}
          </Col>
        </Row>
      </div>
    </ErrorBoundary>
  )
}

export default HomeScreen