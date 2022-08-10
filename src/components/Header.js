import React from 'react';
import { useTranslation} from 'react-i18next';
 
const Header = () => {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("lng", lng)
      };
   return (
       <header>
            <nav className='navbar navbar-nav bg-dark text-white mb-5'>
                <div className="container mx-auto container-fluid">
                    <h1>Loa Engravings</h1>
                    <div>
                        <button className='btn btn-light mx-2' hrefLang="fr" type="button" onClick={() => changeLanguage('fr')}>fr</button>
                        <button className='btn btn-light mx-2' hrefLang="en" type="button" onClick={() => changeLanguage('en')}>en</button>
                    </div>
                </div>
            </nav>
       </header>
   );
};
 
export default Header;