import React from 'react';

import classes from './search.module.scss';

const InputSearch = ({ handleSearchTitle }) => {
	
	return (
			<section className={classes.searchServices}>
				
				<div className={classes.searchServicesTitleWrap} >
					
				<input					
						onChange={(event) => handleSearchTitle(event)}
						type="text"
						className={classes.searchServicesUrl}
						placeholder="Write the service name"
						required />						
				</div>
				
			</section>
	)
};

export default InputSearch;
