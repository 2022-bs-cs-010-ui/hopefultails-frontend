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
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
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

  const categories = useMemo(() => {
    const values = products.map((product) => product?.category).filter(Boolean)
    return Array.from(new Set(values))
  }, [products])

  const brands = useMemo(() => {
    const values = products.map((product) => product?.brand).filter(Boolean)
    return Array.from(new Set(values))
  }, [products])

  const filteredProducts = useMemo(() => {
    const min = minPrice === '' ? null : Number(minPrice)
    const max = maxPrice === '' ? null : Number(maxPrice)

    return products.filter((product) => {
      if (!product) return false
      const nameMatch = product?.name
        ? product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        : false
      const categoryMatch = categoryFilter === 'All' || product?.category === categoryFilter
      const brandMatch = brandFilter === 'All' || product?.brand === brandFilter
      const priceValue = Number(product?.price ?? 0)
      const minMatch = min === null || priceValue >= min
      const maxMatch = max === null || priceValue <= max

      return nameMatch && categoryMatch && brandMatch && minMatch && maxMatch
    })
  }, [products, searchTerm, categoryFilter, brandFilter, minPrice, maxPrice])

  const handleClearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('All')
    setBrandFilter('All')
    setMinPrice('')
    setMaxPrice('')
  }

  return (
    <ErrorBoundary>
      <div>
        <Row>
          <Col md={3}>
            <Card>
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

                  <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="All">All</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="brand">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      as="select"
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                    >
                      <option value="All">All</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </Form.Control>
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
          <Col md={9}>
            <h1>LATEST PRODUCTS</h1>
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}
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
          </Col>
        </Row>
      </div>
    </ErrorBoundary>
  )
}

export default HomeScreen