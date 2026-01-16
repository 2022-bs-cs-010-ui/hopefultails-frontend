import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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

  const filteredProducts = useMemo(() => {
    const min = minPrice === '' ? null : Number(minPrice)
    const max = maxPrice === '' ? null : Number(maxPrice)

    return products.filter((product) => {
      if (!product) return false
      const nameMatch = product?.name
        ? product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        : false
      const priceValue = Number(product?.price ?? 0)
      const minMatch = min === null || priceValue >= min
      const maxMatch = max === null || priceValue <= max

      return nameMatch && minMatch && maxMatch
    })
  }, [products, searchTerm, minPrice, maxPrice])

  const handleClearFilters = () => {
    setSearchTerm('')
    setMinPrice('')
    setMaxPrice('')
  }

  return (
    <ErrorBoundary>
      <div className="pt-3">
        <Row style={{ height: 'calc(100vh - 200px)' }}>
          <Col md={3} style={{ height: '100%' }}>
            <Card style={{ height: '100%' }}>
              <Card.Body>
                <Card.Title>Search & Filters</Card.Title>
                <Form>
                  <Form.Group className="mb-3" controlId="search">
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="minPrice">
                    <Form.Label>Min Price</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="maxPrice">
                    <Form.Label>Max Price</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Any"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="secondary" className="w-100" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={9} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h1>LATEST PRODUCTS</h1>
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
              {!loading && filteredProducts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredProducts.map((val, idx) => (
                    <div key={val?._id ?? idx} style={{ width: '100%' }}>
                      {val ? <Product product={val} /> : null}
                    </div>
                  ))}
                </div>
              )}
              {!loading && filteredProducts.length === 0 && (
                <Message variant="info">No products match your filters.</Message>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </ErrorBoundary>
  )
}

export default HomeScreen