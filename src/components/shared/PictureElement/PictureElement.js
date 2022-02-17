import { useState } from 'react';


import './PictureElement.scss'
const PictureElement = ({
    size,
    isArchived,
    priority,
    imageUrl,
}) => {
    const [styles, setStyles] = useState({
        width: size,
        height: size,
        border: '3px solid',
        borderColor: isArchived ? 'gray' : priority === 'Now' ? '#E2208A' : '#21C097',
    });
    return (
        <section className="picture-element" style={styles}>
            <img src={imageUrl} alt="" />
        </section>
    )
}


export default PictureElement;