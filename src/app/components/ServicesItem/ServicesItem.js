import React, { useState } from 'react';
import classes from './servicesitem.module.scss';

const ServicesItem = ({ id, title, link, modalService, linksSection, isActive, children }) => {

	const [plug, setPlug] = useState(false);
	
	const handleSwitch = () => {
		setPlug(!plug);	
		linksSection(title, link, id);		
		setTimeout(() => {setPlug(false);}, 600);
	}

	return (
		<div className={classes.service}>
		
			<div className={classes.info} >
				{children}
				<div>
					<h3>{title}</h3> 				
					<div className={classes.text}>
						<span
							onClick={() => modalService(link, id)}
							className={classes.delete}>
							<i className="fas fa-window-close"></i>
						</span>
						{link}
					</div>
				</div>
			</div>
			<div>
				<div className={classes.slider}> 
					<div className={plug ? classes.plug : null}></div>
						<input
						onChange={handleSwitch}
						type="checkbox"
						id="slider"
						name={id}					
						checked={isActive} 						
						/>
					<label onClick={() => handleSwitch()} htmlFor={id}></label>
				</div>
			</div>
     </div> 
	)
};

export default ServicesItem;
