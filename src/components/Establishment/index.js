import React, { useState, useEffect } from 'react';
import EstablishmentsService from '../../services/establishment_service';
import Ratings from './Ratings'

import styled from 'styled-components';

const LeftBar = styled.div`
  height: 100%;
  overflow-y: auto;
  width: 250px;
  position: absolute;
  color: white;
  background-color: rgb(5,144,51);
  padding: 20px;
`

const Title = styled.h1`
    font-size: 20px;
    color: #ffffff
`

const Paragraph = styled.p`
    font-size: 13px;
    line-height: 14px;
`

const Image = styled.img`
    height: 150px;
    width: 100%;
`


const Establishment = (props) => {

    const [ establishment, setEstablishment ] = useState([]);
    const { REACT_APP_GOOGLE_API_KEY } = process.env;

    useEffect(() => {
        getEstablishmentDetails();
        //everytime the props  of the selected place changes I want this function getEstablishmentDetails()
        //to run again [props.place]
      }, [props.place])

    async function getEstablishmentDetails() {
        try {
            const response = await EstablishmentsService.show(props.place.place_id);
            //this instance of an establishment will recieve all the props
            //coming from the backend containing all info about that especific
            //store, so setEstablishment will change the current empty state
            //with information about that store.
            setEstablishment(response.data.result);
        } catch(error){
            setEstablishment([])
        }        
    }


    
    return (
            <LeftBar>
                {
                    (establishment.photos) ?
                    <Image src={`
                      https://maps.googleapis.com/maps/api/place/photo?photoreference=${establishment.photos[0].photo_reference}&key=${REACT_APP_GOOGLE_API_KEY}&maxwidth=400 
                      `} alt="Coffee Shop Picture"
                      />
                    : <Image src="/images/no-photo.png" alt="Coffee no Photo"/>
                    
                }
                <Title>{establishment.name}</Title>
                {
                    (establishment.opening_hours) ?
                    <div>
                        { (establishment.opening_hours.open_now === true) ? "Aberto" : "Fechado" } 
                      <hr/>
                       {
                         establishment.opening_hours.weekday_text.map((schedule, index) => {
                         return(<Paragraph key={index}>{schedule}</Paragraph>)
                         })
                        }
                    </div>
                  : <Paragraph> "Horarios de funcionamento e ou fotos do estabelecimento nao foram disponibilizados"</Paragraph>
                }
                <hr/>
                <Paragraph>{establishment.formatted_address}</Paragraph>
                <Ratings place={props.place}/>
            </LeftBar>
        
    )
}

export default Establishment;