import React, {useState, useEffect} from 'react';
import {Form,Row,Col} from 'react-bootstrap';
import Button from '@mui/material/Button';
import {useDispatch,useSelector} from 'react-redux'
import {logoutUser} from '../actions/userActions'
import  Try from './try'
import {
 
    Image,
    ImageButton,
    ImageContainer,
    ImageText,
   
  } from "./Style";

import axios from 'axios'
const RegisterRescueScreen = ({location,history}) =>{
    const dispatch = useDispatch()   
    const userLogin = useSelector(state=>state.userLogin)
    const {userInfo} = userLogin
    const [cordinates, setCordinates] = useState({});
    const [lat,setLat] = useState(0.0);
    const [lng,setLng] = useState(0.0);
    const [data, setData] = useState({  
        title: "",
        background: "",
        image: "",
        experience: "",
        description: "",
      });
    const handleCordinates=(val)=>{
      setCordinates(val);
      setLat(cordinates.lat);
      setLng(cordinates.lng);
  }


    useEffect(() => {
        
       if(userInfo)
       {
         if(userInfo.rescue)
           history.push('/')
       }
       else{
        history.push('/')
       }
    
        
    }, [history,userInfo])

    const changeHandler = (e) => {
        setData({ ...data, image: e.target.files[0] });
      };
    
    const SubmitHandler = (e) => {
        e.preventDefault()
        
          const configuration = {
            headers : {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
          async function register(){
              try{
                  const res = await axios.post(
                      'http://127.0.0.1:8000/api/rescue/create/',
                      {"title":data.title,"background":data.background,"description":data.description,"experience":data.experience,"latitude":lat,"longitude":lng},
                      configuration
                  )
                  const formData = new FormData();
                  formData.append('image',data.image)
                  formData.append('rescue_id',res.data._id)
                  const config = {
                    headers : {
                       'content-type': 'multipart/form-data',
                    }
                }
                  const result = await axios.post(
                    'http://127.0.0.1:8000/api/rescue/pic/',
                    formData,
                    config
                )
                  history.push('/')
                  logOutFunction()
              }catch(error){
                console.log("eroor  ",error)
              }
          }
          register()  
        
        
      }

      const logOutFunction = ()=>{
        dispatch(logoutUser())
      }
    

    return (

        <div>
        <Row>
          <Col md={7}>
          <h1>Sign Up As Rescue</h1>
        <Form onSubmit ={SubmitHandler}>
        <Form.Group className="mb-3" controlId="text">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" required placeholder="Enter your work Title"
             onChange = {(e)=>setData({ ...data, title: e.target.value }) } 
           />
          
        </Form.Group>

        <Form.Group className="mb-3" controlId="text">
          <Form.Label>Background</Form.Label>
          <Form.Control type="text" required placeholder="Enter Your background" 
          onChange = {(e)=>setData({ ...data, background: e.target.value })}  />
        </Form.Group>

        <ImageContainer>
            <Image type="file" name="image" required onChange={changeHandler} />
            <ImageText size="20px" weight="500">
              Drag & drop Cover image here
            </ImageText>
            <ImageButton>
              <ImageText size="20px" weight="500" text="center">
                Select Files
              </ImageText>
            </ImageButton>
            <ImageText size="10px" weight="300">
              Upload 280*280 image
            </ImageText>
          </ImageContainer>
      

        
          <Form.Group className="mb-3" controlId="text">
          <Form.Label>Experience</Form.Label>
          <Form.Control type="number" required placeholder="Enter your Experience"
             onChange = {(e)=>setData({ ...data, experience: e.target.value })} 
           />
          
        </Form.Group>
        <Form.Group className="mb-3" controlId="text">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" required placeholder="Enter your projects etc" 
             onChange = {(e)=>setData({ ...data, description: e.target.value }) } 
           />
          
        </Form.Group>
        <div style={{"display": "flex","alignItems": "right","justifyContent": "right"}}>
          <Button variant='contained' type="submit">Register</Button>
        </div>
       </Form>
       
          </Col>

        <Col md={5}>
        <Try handler={handleCordinates}/>
        </Col>
        </Row>
       </div>
       
          )
}

export default RegisterRescueScreen