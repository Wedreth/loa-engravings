import React, { useState, useEffect } from "react";
import data from '../data.json';
import { useTranslation } from 'react-i18next';
import './Selector.css'

export default function Selector(props) {
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState(props.value);
  const [changedValue, setChangeValue] = useState(props.value !==0 ? true:false);
  const type=props.type || ''
  const keyID=props.keyID
  const disabled=props.disabled || false
  let options = []
  

  function handleChange(e){
    const datakey = e.target.options[e.target.options.selectedIndex].getAttribute('data-key');
    if(e.target.value!==0){
      setChangeValue(!changedValue)
    }
    setValue(e.target.value);
    props.parentCallback(keyID, datakey);
  }

  (function createOptions(){
  
    if(type ==="engraving") {
      for (let j = 0; j < data["engravings"].length; j++) {
          options[j]= <option value={data["engravings"][j].id} key={data["engravings"][j].id} data-key={data["engravings"][j].id}>{t(`engraving.${[data["engravings"][j].name]}`)}</option>;
      }
    }else if(type.startsWith("badengraving")){
      let maxValue = (type=== "badengraving") ? 3 : 10
      for (let j = 0; j < data["bad engravings"].length; j++) {
        if(j!==0){
          for (let k = 0; k <=3; k++) {
            options[4*j+k+1]= <option value={4*parseInt(data["bad engravings"][j].id)+k+1} key={4*parseInt(data["bad engravings"][j].id)+k+1} data-key={4*parseInt(data["bad engravings"][j].id)+k+1}>{`+${k+1} `+t(`engraving.${[data["bad engravings"][j].name]}`)}</option>;
          }
        }else{
          options[j]= <option value={data["bad engravings"][j].id} key={data["bad engravings"][j].id} data-key={data["bad engravings"][j].id}>{t(`engraving.${[data["bad engravings"][j].name]}`)}</option>;
        }
    }
    }else if(type ==="books"){
      for (let j = 0; j <= 12; j+=3) {
          options[j]= <option value={j} key={j} data-key={j}>+{j}</option>;
      }
    }else if(type ==="stone"){
      for (let j = 0; j <= 10; j++) {
          options[j]= <option value={j} key={j} data-key={j}>+{j}</option>;
      }
    }else{
      for (let j = 0; j <= 6; j++) {
        options[j]= <option value={j} key={j} data-key={j}>+{j}</option>;
    }
    }
  })()
  

  return (
    <select className={`form-select ${type} ${changedValue ? 'active':''}`} disabled={disabled} key={keyID} value={value} onChange={handleChange}>
      {options}
    </select>
  );
}