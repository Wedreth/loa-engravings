import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export default function PriceCol(props) {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const init = ()=>{
        console.log("test")
        return searchParams.get("q")+"tutu"
    }

    const [price, setPrice] = React.useState(init());

    // useEffect(()=>{
    //     setPrice(searchParams.get("q"))
    //   },[searchParams])

      const handleChange = (event) => {
        setPrice(event.target.value);
        setSearchParams({q: event.target.value});
      };

    return (
        <>
            <label>{t('Price')}</label>
            <input value={price || ""} type="text" name="name" onChange={handleChange}/>
            {price}
        </>
      );
}