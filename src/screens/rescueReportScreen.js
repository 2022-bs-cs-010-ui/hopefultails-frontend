import React, {useState,useEffect} from 'react';
import {Table,Image,Row,Col} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import axios from 'axios'
import Button from '@mui/material/Button';

import Rating from '../components/Rating'

const RescueReportScreen = ({history}) =>{

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
        async function rescueList(){
          
            try{
                setLoading(false)
                const configuration = {
                    headers : {
                        'Content-type':'application/json',
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
            
                    const {data} =await axios.get('http://127.0.0.1:8000/api/report/get/',
                        configuration
                    )
                setTeams(data)
                setState(1)
                setLoading(false)
            }
            catch(err){
                setError(err)
                setState(1)
            }
            
        }
        rescueList()
    }
    }

    else{
        history.push('/login')
    }
             
    }, [history,userInfo,teams,state,error])

   
    return (
    <div>
            <h2>Available Reports</h2>
            {loading ? <Loader></Loader>
            :
            error ? <Message>{error}</Message>
            :(
              teams &&(
                <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>
                            Location
                        </th>
                        <th>
                            Details
                        </th>
                        <th>
                            Contact
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
                                            t.location
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
export default RescueReportScreen;