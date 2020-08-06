import React from 'react';

import classes from './removeservices.module.scss';

const RemoveServices = ({ isActiveBtn, modalStorage }) => {
	return (
		 <div className={classes.removeServices}>
			<button
				onClick={isActiveBtn ? () => modalStorage(): null}
				className={isActiveBtn ?
					classes.btnClearStorage :
					classes.btnClearStorageDisabled}>
				Clear All Services
			</button>
     </div> 
	)
};

export default RemoveServices;
