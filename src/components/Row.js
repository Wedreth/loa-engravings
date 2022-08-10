import React, { useState } from "react";
import data from './../data.json';
import { useTranslation } from 'react-i18next';


export default function Row(props) {
    const { t, i18n } = useTranslation();
    const [value, setValue] = useState([]);
    
    const type=props.type
    const name=props.name

    function handleChange(e){
        let items = [...this.state.items]
        items[e.target.key] = e.target.value
        setValue(items);
    }

    let selects = Array(6)
    if(type ==="engraving") {
        for(let i = 0; i < 6; i++) {
            let options = []
            for (let j = 0; j < data.length; j++) {
                options[j]= <option key={data.id}>{t(`engraving.${[data[j]['name']]}`)}</option>;
            }
            selects[i]= <select name={name} key={i}>{options}</select>
        }
    }else{
        for(let i = 0; i < 6; i++) {
            let options = []
            for (let j = 0; j < 10; j++) {
                options[j]= <option key={"a"+j}>+{j}</option>;
            }
            selects[i]= <select name={name} value={value} onChange={handleChange}>{options}</select>
        }
    }
    return (
        <form>
            <h3>{name}</h3>
            {selects}
        </form>
    )
}