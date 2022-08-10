import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PriceCol from './PriceCol';
import Table from './Table';
 
const Body = () => {
    const { t, i18n } = useTranslation();


   return (
       <main className='container mx-auto'>
            <Table />
        </main>
   );
};
 
export default Body;