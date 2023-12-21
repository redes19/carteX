import React, { useState } from 'react';
import Card from './Card';
import axios from "axios";
import $ from 'jquery';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

export default function CardsPanel() {
    const [cardList, setCardList] = useState([{}]);

    const fetchCards= () => {
        let url = "http://localhost:3001/cards";
        axios.get(url)
        .then(res => {
            setCardList(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }
    fetchCards();

    const modifyCard = (e) => {
        window.location.href = "http://localhost:3000/modifyCard/"+e;
    }

    const deleteCard = (e) => {
        $.ajax({
            url: 'http://localhost:8000/src/Back/PHP/component/deleteCard.php',
            method: 'POST',
            dataType: 'json',
            data: { 
                id: e 
            },
            success: function (response) {
              console.log(response)
            },
            error: function (error) {
                console.error(error);
            },
          });
          fetchCards();
    }
    


  return (
    <div className='cardsPanel'>
        <table>
            <tr className="cardsPanel-header">
                <th className='cardsPanel-header-name'>
                    Nom
                </th>
                <th className='cardsPanel-header-cardId'>
                    ID officiel
                </th>
                <th className='cardsPanel-header-id'>
                    ID
                </th>
                <th className='cardsPanel-header-modify'>
                    Action
                </th>
            </tr>
            {cardList.map((card, index) => {
                return (
                    <tr className="cardsPanel-card" key={index}>
                        <th className='cardsPanel-card-name'>
                            {card.name}
                        </th>
                        <th className='cardsPanel-card-cardId'>
                            {card.cardId}
                        </th>
                        <th className='cardsPanel-card-id'>
                            {card.id}
                        </th>
                        <th className='cardsPanel-card-modify'>
                            <Button size="medium" onClick={(e) => modifyCard(card.id)} value={card.id}>Modifier</Button>
                        </th>
                        <th className='cardsPanel-card-delete'>
                        <IconButton aria-label="delete" onClick={(e) => deleteCard(card.id)} value={card.id}>
                          <DeleteIcon/>
                        </IconButton>
                        </th>
                    </tr>
                )
            })}
        </table>
    </div>
  )
}
