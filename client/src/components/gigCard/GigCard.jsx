import React from 'react';
import {Link} from "react-router-dom";
import {useQuery} from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import './GigCard.scss';

const GigCard = ({item}) => {

    const { isLoading, error, data} = useQuery({
        queryKey: [item.userId],
        queryFn: () =>
         newRequest.get(`/users/${item.userId}`).then((res) => {
            return res.data;
         }),
     });

  return (
    <Link to={`/gig/${item._id}`} className='link'>
    <div className='GigCard'>
        <img src={item.cover} alt="Gig Image" />
        <div className="info">
            {isLoading? "loading.." : error ? "Something went wrong..." : (<div className="user">
                <img src={data.img || "/img/profile.png"} alt="" />
                <span>{data.username}</span>
            </div>)}
            <p>{item.title}</p>
            <div className="star">
                <img src="./img/star.png" alt="star" />
                <span>{!isNaN(item.totalStars/item.starNumber) && Math.round(item.totalStars/item.starNumber)}</span>
            </div>
        </div>
        <hr />
        <div className="details">
            <img src="./img/heart.png" alt="" />
            <div className="price">
                <span>STARTING AT</span>
                <h2>${item.price}</h2>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default GigCard;