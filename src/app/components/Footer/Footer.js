import React from 'react';

import classes from './footer.module.scss';

const Footer = ({
	isActiveBtn,
	modalStorage,
	isSearch,
	toggleIsSearch,
	sortServicesUp,
	sortServicesDown,
	reverseServices }) => {

	return (
		<div className={classes.removeServices}>
			<button
				onClick={() => sortServicesUp()}
				className={classes.btnExchangeServices}>
				<i className="fas fa-sort-alpha-down"></i>
			</button>

			<button
				onClick={() => sortServicesDown()}
				className={classes.btnExchangeServices}>
				<i className="fas fa-sort-alpha-up"></i>
			</button>
			
			<button
				onClick={() => reverseServices()}
				className={classes.btnExchangeServices}>
				<i className="fas fa-sync-alt"></i>
			</button>

			<button
				onClick={() => toggleIsSearch()}
				className={isSearch ?
					classes.btnSearchServicesActive :
					classes.btnSearchServices}>
				<i className="fas fa-search"></i>
			</button>

			<button
				onClick={isActiveBtn && !isSearch ? () => modalStorage(): null}
				className={isActiveBtn && !isSearch ?
					classes.btnClearStorage :
					classes.btnClearStorageDisabled}>
				<i className="fas fa-trash-alt"></i>
			</button>

     </div> 
	)
};

export default Footer;
