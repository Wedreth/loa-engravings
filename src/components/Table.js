import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import data from '../data.json';
import { useSearchParams } from 'react-router-dom'
import Selector from './Selector';
import './Table.css';
 
const Table = () => {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState({ "q" : "", "p" : ""})
    const [searchParams, setSearchParams] = useSearchParams(query);
    const defaultArray = {
        "z":[0,0,0,0,0,0],
        "y":[0,0,0,0,0,0,0],
        "x":[0,0,0,0,0,0,0],
        "w":[0,0,0,0,0,0,0],
        "v":[0,0,0,0,0,0,0],
        "u":[0,0,0,0,0,0,0],
        "t":[0,0,0,0,0,0,0],
        "s":[0,0,0,0,0,0,0],
    };

    const isSlot = (string, i)=>{
        if(string[i]===undefined || string[i] in defaultArray){
            return false
        }else{
            return true            
        }
    }
    const stringToTable = ( string = searchParams.get("q"), array=null, i=0)=>{
        if(array===null){
            array={
                "z":[0,0,0,0,0,0],
                "y":[0,0,0,0,0,0,0],
                "x":[0,0,0,0,0,0,0],
                "w":[0,0,0,0,0,0,0],
                "v":[0,0,0,0,0,0,0],
                "u":[0,0,0,0,0,0,0],
                "t":[0,0,0,0,0,0,0],
                "s":[0,0,0,0,0,0,0],
            }
        }
        if(string === null || string[i] === undefined) return array
        let slot,trinket
        trinket = string[i]
        i+=1
        do{
            slot = string[i].charCodeAt(0) - 97
            i++
            let value = 0
            do{
                value += string[i];
                i++
            }while(string[i] !== undefined && !Boolean(string[i].match(/[a-z]/i)))
            value = parseInt(value)
            
            array[trinket][slot] = value
        }while(isSlot(string, i))


        if(string[i] !== undefined){
            array = stringToTable(string, array, i)
        }
        return array
        
    }
    const [table, setTable] = useState(stringToTable())
    
    const stringToPrice= (string = searchParams.get("p"), array=[0,0,0,0,0,0,0], i=0)=>{
        if(string === null || string[i] === undefined) return array
        let slot
        let value= ""
        slot = string[i].charCodeAt(0) - 97
        i++
        do{
            value += string[i];
            i++
        }while(string[i] !== undefined && !Boolean(string[i].match(/[a-z]/i)))
        array[slot] = parseInt(value)

        if(string[i] !== undefined){
            array = stringToPrice(string, array, i)
        }
        return array
    }
    const [pricesArray, setPricesArray] = useState(stringToPrice())

    const tableToString = () => {
        let string = ""
        for (let key in table) {
            let trinket=key
            for (let i = 0; i < table[key].length; i++) {
                if(table[key][i] !== 0){
                   trinket+=String.fromCharCode(97 + i)+table[key][i];
                }                
            }
            if(trinket !== key){
                string+=trinket
            }
          }
        
        let newQuery = {...query}
        newQuery["q"]=string
        setQuery(newQuery)
        setSearchParams(newQuery);
    }
        
    const [sumPrices, setSumPrices] = useState(pricesArray.reduce((partialSum, a) => partialSum + a, 0))

    const handlePriceChange = (e) =>{
        let prices = [...pricesArray]
        prices[e.target.getAttribute('data-key')] = parseInt(e.target.value)
        setPricesArray(prices)
        setSumPrices(prices.reduce((partialSum, a) => partialSum + a, 0))
        let string = ""
        prices.forEach((e, id) => {
            if(e!==0){
                string+= String.fromCharCode(97 + id)+e
            }
        });
        let newQuery = {...query}
        newQuery["p"]=string
        setQuery(newQuery)
        setSearchParams(newQuery);
    }
    const handleCallback = (id, value) => {        
        const before = id.slice(0, id.length-1)
        const after = id.slice(id.length-1).charCodeAt(0) - 97
        let items = table
        items[before][after] = parseInt(value)
        setTable(items)
        tableToString()
    }
    const sum = (id) => {
        let total = 0;
        for (let key in table) {
            if(key !== "z"){
                total+=table[key][id]
            }
          }
        return total;
    }
    const imageUrl = (i) =>{
        let id = table["z"][i]
        let engraving = data["engravings"].find(e=>e.id===id).name.toLowerCase()
        if(engraving === 'none') return
        return <img src={process.env.PUBLIC_URL+'/img/'+engraving+'.webp'}></img>
    }
    
    // const reset = ()=>{
    //     console.log("reset")
    //     console.log("defaultArray")
    //     console.log(defaultArray)
    //     setTable({...defaultArray})
    //     setPricesArray([0,0,0,0,0,0,0])
    //     setSumPrices(0)
    //     setQuery({ "q" : "", "p" : ""})
    //     setSearchParams({ "q" : "", "p" : ""})
    // }
   return (
    <>
    
       <table className='table table-hover table-dark rounded'>
            <thead className='table-dark'>
                <tr>
                    <th scope="col">{t("Engravings")}</th>
                    <th scope="col"><Selector value={table["z"][0]} type="engraving" keyID="za" parentCallback={handleCallback}/></th>
                    <th scope="col"><Selector value={table["z"][1]} type="engraving" keyID="zb" parentCallback={handleCallback}/></th>
                    <th scope="col"><Selector value={table["z"][2]} type="engraving" keyID="zc" parentCallback={handleCallback}/></th>
                    <th scope="col"><Selector value={table["z"][3]} type="engraving" keyID="zd" parentCallback={handleCallback}/></th>
                    <th scope="col"><Selector value={table["z"][4]} type="engraving" keyID="ze" parentCallback={handleCallback}/></th>
                    <th scope="col"><Selector value={table["z"][5]} type="engraving" keyID="zf" parentCallback={handleCallback}/></th>
                    <th scope="col" colSpan="2">{t("Bad Engravings")}</th>
                    <th scope="col">{t("Prices")}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td scope="row">{t("Necklace")}</td>
                    <td><Selector type="value" disabled={(table["z"][0]===0)} value={table["y"][0]} keyID="ya" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][1]===0)} value={table["y"][1]} keyID="yb" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][2]===0)} value={table["y"][2]} keyID="yc" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][3]===0)} value={table["y"][3]} keyID="yd" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][4]===0)} value={table["y"][4]} keyID="ye" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][5]===0)} value={table["y"][5]} keyID="yf" parentCallback={handleCallback}/></td>
                    <td colSpan="2"><Selector type="badengraving" value={table["y"][6]} keyID="yg" parentCallback={handleCallback}/></td>
                    <td><input type="number" data-key="0" value={parseInt(pricesArray[0])} onChange={handlePriceChange}></input></td>
                </tr>
                <tr>
                    <td scope="row">{t("Earring")+" 1"}</td>
                    <td><Selector type="value" disabled={(table["z"][0]===0)} value={table["x"][0]} keyID="xa" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][1]===0)} value={table["x"][1]} keyID="xb" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][2]===0)} value={table["x"][2]} keyID="xc" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][3]===0)} value={table["x"][3]} keyID="xd" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][4]===0)} value={table["x"][4]} keyID="xe" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][5]===0)} value={table["x"][5]} keyID="xf" parentCallback={handleCallback}/></td>
                    <td colSpan="2"><Selector type="badengraving" value={table["x"][6]} keyID="xg" parentCallback={handleCallback}/></td>
                    <td><input type="number" data-key="1" value={parseInt(pricesArray[1])} onChange={handlePriceChange}></input></td>
                </tr>
                <tr>
                    <td scope="row">{t("Earring")+" 2"}</td>
                    <td><Selector type="value" disabled={(table["z"][0]===0)} value={table["w"][0]} keyID="wa" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][1]===0)} value={table["w"][1]} keyID="wb" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][2]===0)} value={table["w"][2]} keyID="wc" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][3]===0)} value={table["w"][3]} keyID="wd" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][4]===0)} value={table["w"][4]} keyID="we" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][5]===0)} value={table["w"][5]} keyID="wf" parentCallback={handleCallback}/></td>
                    <td colSpan="2"><Selector type="badengraving" value={table["w"][6]} keyID="wg" parentCallback={handleCallback}/></td>
                    <td><input type="number" data-key="2" value={parseInt(pricesArray[2])} onChange={handlePriceChange}></input></td>                    
                </tr>
                <tr>
                    <td scope="row">{t("Ring")+" 1"}</td>    
                    <td><Selector type="value" disabled={(table["z"][0]===0)} value={table["v"][0]} keyID="va" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][1]===0)} value={table["v"][1]} keyID="vb" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][2]===0)} value={table["v"][2]} keyID="vc" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][3]===0)} value={table["v"][3]} keyID="vd" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][4]===0)} value={table["v"][4]} keyID="ve" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][5]===0)} value={table["v"][5]} keyID="vf" parentCallback={handleCallback}/></td>
                    <td colSpan="2"><Selector type="badengraving" value={table["v"][6]} keyID="vg" parentCallback={handleCallback}/></td>
                    <td><input type="number" data-key="3" value={parseInt(pricesArray[3])} onChange={handlePriceChange}></input></td>
                </tr>
                <tr>
                    <td scope="row">{t("Ring")+" 2"}</td>  
                    <td><Selector type="value" disabled={(table["z"][0]===0)} value={table["u"][0]}keyID="ua" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][1]===0)} value={table["u"][1]}keyID="ub" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][2]===0)} value={table["u"][2]}keyID="uc" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][3]===0)} value={table["u"][3]}keyID="ud" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][4]===0)} value={table["u"][4]}keyID="ue" parentCallback={handleCallback}/></td>
                    <td><Selector type="value" disabled={(table["z"][5]===0)} value={table["u"][5]}keyID="uf" parentCallback={handleCallback}/></td>
                    <td colSpan="2"><Selector type="badengraving" value={table["u"][6]} keyID="ug" parentCallback={handleCallback}/></td>
                    <td><input type="number" data-key="4" value={parseInt(pricesArray[4])} onChange={handlePriceChange}></input></td>
                </tr>
                <tr>
                    <td scope="row">{t("Books")}</td>  
                    <td><Selector value={table["t"][0]} disabled={(table["z"][0]===0)} type="books" keyID="ta" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["t"][1]} disabled={(table["z"][1]===0)} type="books" keyID="tb" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["t"][2]} disabled={(table["z"][2]===0)} type="books" keyID="tc" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["t"][3]} disabled={(table["z"][3]===0)} type="books" keyID="td" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["t"][4]} disabled={(table["z"][4]===0)} type="books" keyID="te" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["t"][5]} disabled={(table["z"][5]===0)} type="books" keyID="tf" parentCallback={handleCallback}/></td>
                    <td colSpan="2"><Selector  type="badengraving" value={table["t"][6]} keyID="tg" parentCallback={handleCallback}/></td>
                    <td><input type="number" data-key="5" value={parseInt(pricesArray[5])} onChange={handlePriceChange}></input></td>
                </tr>
                <tr>
                    <td scope="row">{t("Ability Stone")}</td>  
                    <td><Selector value={table["s"][0]} disabled={(table["z"][0]===0)} type="stone" keyID="sa" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["s"][1]} disabled={(table["z"][1]===0)} type="stone" keyID="sb" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["s"][2]} disabled={(table["z"][2]===0)} type="stone" keyID="sc" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["s"][3]} disabled={(table["z"][3]===0)} type="stone" keyID="sd" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["s"][4]} disabled={(table["z"][4]===0)} type="stone" keyID="se" parentCallback={handleCallback}/></td>
                    <td><Selector value={table["s"][5]} disabled={(table["z"][5]===0)} type="stone" keyID="sf" parentCallback={handleCallback}/></td>
                    <td colSpan="2"><Selector type="badengravingstone" value={table["s"][6]} keyID="sg" parentCallback={handleCallback}/></td>
                    <td><input type="number" data-key="6" value={parseInt(pricesArray[6])} onChange={handlePriceChange}></input></td>
                </tr>
                <tr>
                    <td scope="row">Total</td>  
                    <td> <div className='sum'>{sum(0)}{imageUrl(0)}</div></td>
                    <td> <div className='sum'>{sum(1)}{imageUrl(1)}</div></td>
                    <td> <div className='sum'>{sum(2)}{imageUrl(2)}</div></td>
                    <td> <div className='sum'>{sum(3)}{imageUrl(3)}</div></td>
                    <td> <div className='sum'>{sum(4)}{imageUrl(4)}</div></td>
                    <td> <div className='sum'>{sum(5)}{imageUrl(5)}</div></td>
                    <td colSpan="2"></td>
                    <td align='right'>{sumPrices}</td>

                </tr>
            </tbody>
       </table>
        <div>
            <button type="button" className="btn btn-primary" onClick={() => {navigator.clipboard.writeText(window.location.href)}}>copy link</button>
            {/* <button type="button" className="btn btn-danger" onClick={()=>{reset()}}>reset</a> */}
        </div>
    </>
   );
};
 
export default Table;