import {Container,Row,Col} from 'react-bootstrap'

const Footer=()=> {
    return (
        <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, textAlign: 'center', padding: '12px 0', backgroundColor: '#212529', color: 'white', width: '100%', zIndex: 999 }}>
          <Container> 
        <Row>
        <Col>
        CopyRight &copy; Hopeful Tails
        </Col>
        </Row>

        </Container>
       
        </footer>
    )
}

export default Footer