import React, {useState,useEffect} from 'react';
import {Table,Image,Row,Col} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import axios from 'axios'
import Button from '@mui/material/Button';

import Rating from '../components/Rating'

const VetAppointmentScreen = ({history}) =>{

    const [loading,setLoading] = useState(true)
    const [error,setError] = useState()
    const [teams,setTeams] = useState([])
    const [state,setState] = useState(0)
    
    //states
    const userLogin = useSelector(state=>state.userLogin)
    const {userInfo} = userLogin
  
    useEffect(() => {

        if(userInfo){

        if(state===0){
        async function vetList(){
          
            try{
                setLoading(false)
                const configuration = {
                    headers : {
                        'Content-type':'application/json',
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
            
                    const {data} =await axios.get('http://127.0.0.1:8000/api/appointment/pending/',
                        configuration
                    )
                console.log("appoint he ye      ",data)
                setTeams(data)
                setState(1)
                setLoading(false)
                console.log("teams he ye      ",teams)
            }
            catch(err){
                setError(err)
                setState(1)
            }
            
        }
        vetList()
    }
    }

    else{
        history.push('/login')
    }
             
    }, [history,userInfo,teams,state,error])

   
    return (
    <div>
            <h2>Available Appointments</h2>
            {loading ? <Loader></Loader>
            :
            error ? <Message>{error}</Message>
            :(
              teams &&(
                <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>
                            Due
                        </th>
                        <th>
                            Details
                        </th>
                        <th>
                            Contact
                        </th>
                        <th>
                            Slot 
                        </th>
                        
                    </tr>

                </thead>

                <tbody>
                    {
                        teams && userInfo&&(
                            teams.map(
                                t=>{
                                return(
                                    <tr key={t._id}>
                                        <td>
                                        {
                                            t.date
                                        }
                                        </td>
                                        <td>
                                        {
                                            t.details
                                        }
                                        </td>
                                        <td>
                                        {
                                            t.phonenumber
                                        }
                                        </td>
                                        <td>
                                        {
                                            t.slot
                                        }{" "}pm
                                        </td>
                                    </tr>
                                )
                            })
                        )
                    }
                </tbody>

            </Table>
              )
           
            )}
            
    </div>
    )
}
export default VetAppointmentScreen