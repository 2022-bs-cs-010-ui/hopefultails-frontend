import React, {useState, useEffect} from 'react';
import {Form,Button,Row,Col,Table} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {detailedUser,updatedUser} from '../actions/userActions'
import {allOrdersList} from '../actions/orderActions'
import {USER_UPDATE_RESET} from '../constants/userConstants'
import VetAppointmentScreen from './vetAppointmentsScreen';
import RescueReportScreen from './rescueReportScreen';
import axios from 'axios';

const ProfileScreen = ({history}) =>{
    const dispatch=useDispatch()
    
    const [email,setEmail] = useState('')
    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [message,setMessage] = useState('')
    const [state,setState] = useState(1)
    const [ordersSell,setOrdersSell] = useState([])
    

    const userDetails = useSelector(state=>state.userDetails)
    const {error,loading, user} = userDetails

    const userLogin = useSelector(state=>state.userLogin)
    const {userInfo} = userLogin

    const userUpdate = useSelector(state=>state.userUpdate)
    const {success} = userUpdate

    const allOrders = useSelector(state=>state.allOrders)
    const {loading:loadingOrders, orders, error:errorOrders} = allOrders
    const [sta,setSta] = useState("true")
    
    
    useEffect(() => {

            if(state === 1){

                async function sellOrders(){
                    const configuration = {
                    headers : {
                        'Content-Type' : 'application/json',
                        'Accept' : 'application/json',
                        'Authorization' : `Bearer ${userInfo.token}`
                      }
                    }
                    const {data} =await axios.get(
                            `http://127.0.0.1:8000/api/orders/getall/`,
                            configuration
                            )
                    setOrdersSell(data)
                }
                sellOrders()
                setState(0)
            }

            if(!userInfo)
            {
                history.push('/login')
            }
            else
            {
                if (sta == "true"){
                    setSta("false")
                    if(!user || !user.name ||success || userInfo._id !== user._id)
                {
                    dispatch({type: USER_UPDATE_RESET})
                    dispatch(detailedUser())

                    dispatch(allOrdersList())
                }
                 else{
                     setName(user.name)
                     setEmail(user.email)
                 }
                }
                
            }       
    }, [dispatch,history,userInfo,user,success,orders,state,ordersSell])

    const send =(e)=>{
        e.preventDefault()
        if(password !== confirmPassword)
        {
            setMessage('PassWords Did Not Match')
        }
        else
        {
        dispatch(updatedUser(name,email,password))
        setMessage('')
        }
    }

    const summary = (id) =>{
        history.push(`/order/${id}`)
    }

    return (
    <div>
        {message && <Message variant = 'dark' >{message}</Message>}
    <Row>
        <Col md={3}>

          <h2>User Profile</h2>
          {error && <Message variant='dark'> {error} </Message>}
          {loading && <Loader/>}
          <Form onSubmit={send}>
                    <Form.Group className="mb-3" controlId="text">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text"  placeholder="Enter your full name" value={name}
                        onChange = {(e)=>setName(e.target.value)}
                    />
                    
                    </Form.Group>
                
                    <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email"  placeholder="Enter email" value={email}
                        onChange = {(e)=>setEmail(e.target.value)}
                    />
                    
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter Password" value={password}
          onChange = {(e)=>setPassword(e.target.value)}  />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm Your Password" value={confirmPassword}
          onChange = {(e)=>setConfirmPassword(e.target.value)}  />
        </Form.Group>
                    
                    <Button variant="primary" type="submit">
                    Update
                    </Button>
           </Form>
        </Col> 
        
        <Col md={9}>
            {
                userInfo && userInfo.vet ? (<VetAppointmentScreen></VetAppointmentScreen>)
                :
                userInfo && userInfo.rescue ? (<RescueReportScreen></RescueReportScreen>)
                :
                (
                    <div>
                        <h2>Buy </h2>
            {loadingOrders ? 
                
                <Loader/>
                :
                errorOrders ? 
                <Message variant='danger'>{errorOrders}</Message>
                :
                (<Table striped responsive className="table-sm">
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            DATE
                        </th>
                        <th>
                            TOTAL
                        </th>
                        <th>
                            PAID
                        </th>
                        <th>
                            DELIVERED
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        orders.map(val=>
                        {
                            return (
                                <tr>
                                    <td>
                                        {val._id}                                        
                                    </td>

                                    <td>
                                        {val.createdAt.substring(0,10)}                                        
                                    </td>
                                    <td>
                                        {val.totalPrice}                                        
                                    </td>
                                    <td>
                                        {
                                            val.isPaid ?
                                            val.paidAt.substring(0,10)
                                            :
                                            <i className='fas fa-times' style={{color:'red'}}></i>
                                        }                                        
                                    </td>

                                    <td>
                                        <Button className='btn-sm' onClick={()=>summary(val._id)}>
                                            DETAILS
                                        </Button>                                        
                                    </td>

                                </tr>
                            )
                        })
                    }
                </tbody>

            </Table>)
            }
            <br/><br/>
            <br/><br/>
            <br/><br/>
            <br/><br/>
            <br/><br/>
            <div>
            <h2>Sell </h2>
              <Table striped responsive className="table-sm">
                     <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            DATE
                        </th>
                        <th>
                            TOTAL
                        </th>
                        <th>
                            PAID
                        </th>
                        <th>
                            DELIVERED
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        ordersSell && ordersSell.map(val=>
                        {
                            return (
                                <tr>
                                    <td>
                                        {val._id}                                        
                                    </td>

                                    <td>
                                        {val.createdAt.substring(0,10)}                                        
                                    </td>
                                    <td>
                                        {val.totalPrice}                                        
                                    </td>
                                    <td>
                                        {
                                            val.isPaid ?
                                            val.paidAt.substring(0,10)
                                            :
                                            <i className='fas fa-times' style={{color:'red'}}></i>
                                        }                                        
                                    </td>

                                    <td>
                                        <Button className='btn-sm' onClick={()=>summary(val._id)}>
                                            DETAILS
                                        </Button>                                        
                                    </td>

                                </tr>
                            )
                        })
                    }
                </tbody>

            </Table>
            
                    </div>

                    </div>
                )
            }
  
        </Col>    

    </Row>
    </div>
    )
}
export default ProfileScreen