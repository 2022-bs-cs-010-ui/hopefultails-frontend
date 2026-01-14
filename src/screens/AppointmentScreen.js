import React, {useState, useEffect} from 'react';
import {Row,Col} from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import Button from '@mui/material/Button';
import Message from '../components/Message'
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown';

const AppointmentScreen = ({match,history}) =>{

    const id = match.params.id

    const [details,setDetails] = useState('')
    const [phoneNumber,setPhoneNumber] = useState('')
    const [date,setDate] = useState('')
    const [state,setState] = useState(1)
    const [error,setError] = useState()
    const [message,setMessage] = useState()
    const [slots,setSlots] = useState({})
    const [slotName,setSlotName] = useState("")

    const userLogin = useSelector(state=>state.userLogin)
    const {userInfo} = userLogin

    useEffect(() => {
        
        if(userInfo)
        {
          if (state===1){
            async function postAppointment(){
                  
              try{
                     
                const configuration = {
                  headers : {
                      'Content-type':'application/json',
                      Authorization: `Bearer ${userInfo.token}`
                  }
              }   
              const {data} =await axios.get(
                  `http://127.0.0.1:8000/api/booking/available-slots/${id}/`,
                  configuration
                  )
                setSlots(data.availableSlots)
              }
              catch(err){
              
                 //console.log(err)
                 setError(err)
              }
              
          }
          postAppointment()

          }
            
        }
        else{
            history.push('/login')
        }
    
        
    }, [history,userInfo,state,error,message])

    const send =(e)=>{
        e.preventDefault()
        console.log("slot name  ",slotName)
        async function postAppointment(){
                  
                    try{
                      const configuration = {
                        headers : {
                            'Content-type':'application/json',
                            Authorization: `Bearer ${userInfo.token}`
                        }
                    }     
                    let tosend=""
                    if (slotName){
                        tosend=slotName
                    }           
                    else{
                      tosend = slots[Object.keys(slots)[0]];
                    }
                    const {data} =await axios.post(
                        `http://127.0.0.1:8000/api/appointment/create/${id}/`,
                        {'phonenumber':phoneNumber,'slot': tosend, 'details':details},
                        configuration
                        )
                      //console.log("daaaata->    ",data)
                      setMessage(data)
                      history.push("/vets")
                    }
                    catch(err){
                    
                       //console.log(err)
                       setError(err)
                    }
                    
                }
                postAppointment()
         
     
    }
    return (

  
      message ? 
      (
        <div>
          <Message variant = 'dark' >{message.detail}</Message>
          <Row>
            <Col>
    
                <Link to ='/vets'> Go Back</Link>
            </Col>
        </Row>
        </div>
      
      )
      :error ?
       <Message variant='dark'> {error.detail} </Message>
      :(
        <div>
  
        <h1>Enter appointment DetaiLs</h1>
      <Form onSubmit ={send}>
        
        <Form.Group className="mb-3" controlId="details">
          <Form.Label>Enter your animal details and illness</Form.Label>
          <Form.Control
          type="textarea" placeholder="description..." value={details} 
             onChange = {(e)=>setDetails(e.target.value)} 
           />
          
        </Form.Group>

        <Form.Label>Available Slots</Form.Label>
        <Form.Control as="select" value={slotName} onChange={(e)=>setSlotName(e.target.value)} >

        {
            Object.keys(slots).map((val,i)=>
            {
                return(     
                <option key={i} value={slots[val]}>
                {slots[val]}{"  "}pm 
                </option>)
            }
            )
        }

        </Form.Control>

              
        <Form.Group className="mb-3" controlId="phoneNumber">
          <Form.Label>phoneNumber</Form.Label>
          <Form.Control
           type="phoneNumber" placeholder="Enter phoneNumber" value={phoneNumber}
          onChange = {(e)=>setPhoneNumber(e.target.value)}  />
        </Form.Group>
                
        <Button variant="contained" type="submit">Post Report</Button>
       </Form>
       </div>
      
      )    
    )
}

export default AppointmentScreen
