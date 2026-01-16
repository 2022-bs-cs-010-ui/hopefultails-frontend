import React, {useState,useEffect} from 'react';
import {Table,Image,Row,Col} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import axios from 'axios'

import Rating from '../components/Rating'

const RescueTeamScreen = ({history}) =>{

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
                const configuration = {
                    headers : {
                        'Content-type':'application/json',
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
            
                    const {data} =await axios.get('http://127.0.0.1:8000/api/rescue/rescue-teams/',
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
            <h2>Available Rescue Teams</h2>
            {loading ? <Loader></Loader>
            :
            error ? <Message>{error}</Message>
            :(
           <Table bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Location
                        </th>
                        <th>
                            Rating
                        </th>
                        <th>
                            Description
                        </th>
                       
                        <th>
                            Report
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
                                            <div style={{ width: '200px' }}>
                                                <div style={{ position: 'relative', width: '180px', height: '180px', overflow: 'hidden', background: 'transparent', padding: '12px', boxSizing: 'border-box', borderRadius: '10px' }}>
                                                    <Image
                                                        src={"http://127.0.0.1:8000" + t.image}
                                                        alt={t.email || t.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                                    />
                                                </div>
                                                <div style={{ marginTop: '6px', fontSize: '14px', color: '#333' }}>
                                                    {t.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {t.location}
                                        </td>
                                        <td>
                                           
                                            <Rating value= {t.rating} color={'yellow'}/>
                                        </td>
                                        <td>
                                            {t.description}
                                        </td>

                                        <td>
                                        <LinkContainer style={{cursor:'pointer'}} to={`/report-form/${t._id}`}>
                                    <i className='fas fa-book' ></i>
                                    </LinkContainer>
                                        </td>
                                      
                                    </tr>
                                )
                            })
                        )
                    }
                </tbody>

            </Table>
            )}
            
    </div>
    )
}
export default RescueTeamScreen