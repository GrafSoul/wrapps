import React from 'react';

import classes from './addform.module.scss';

const AddForm = ({ link, isActiveBtn, handleNewLinkUrl, handleNewLinkForm }) => {

	const handleKeyPress = (event) => {	
		if (event.key === 'Enter' &&
				event.target.validity.valid) {
        handleNewLinkUrl(event);
				handleNewLinkForm(event);
				event.target.value = '';
      }
	}
	
	return (
		<form onSubmit={(event) => handleNewLinkForm(event)}>
			<section className={classes.addNewServices}>
				
				<div className={classes.newServicesUrlWrap} >
					
					<input
						value={link}
						onChange={(event) => handleNewLinkUrl(event)}
						onKeyPress={handleKeyPress}
						type="url"
						className={classes.newServicesUrl}
						placeholder="Add URL and press Enter"
						required />
						
					</div>	
					<div className={classes.newServicesSubmitWrap} >
					<button					
						type="submit"
						disabled={!isActiveBtn}
						className={isActiveBtn ?
							classes.newServicesSubmit :
							classes.newServicesSubmitDisabled
							 }>Add</button>
					</div>	
				
			</section>
		</form>
	)
};

export default AddForm;
