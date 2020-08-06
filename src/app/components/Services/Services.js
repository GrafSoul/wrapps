import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Droppable, Draggable } from "react-beautiful-dnd";
import classes from './services.module.scss';

import ServicesItem from '../../components/ServicesItem/ServicesItem';

const Services = ({ services, modalService, linksSection }) => {

	const publicServices = services.map((service, index) => {		
		return (
			<Draggable key={service.id} draggableId={service.id} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					style={getItemStyle(
						snapshot.isDragging,
						provided.draggableProps.style
					)}>				
					<ServicesItem 		
						key={index}
						id={service.id}
						title={service.title}
						link={service.link}
						isActive={service.active}
						modalService={modalService}
						linksSection={linksSection}>
						<span className={classes.drag} {...provided.dragHandleProps} ><i className="far fa-ellipsis-v"></i></span>
					</ServicesItem>
				</div>
      )}
		</Draggable>
		)			
	})

	const cleanServices = publicServices.filter(function(x){
			return x !== undefined && x !== null; 
	});	

	const getItemStyle = (isDragging, draggableStyle) => ({
		userSelect: "none",
		border: 'none',
		background: isDragging ? "#1a1d22" : "#282c34",
		...draggableStyle
	});
	
	const getListStyle = isDraggingOver => ({
		paddingRight: '12px',
		boxShadow: isDraggingOver ? '0 3px 100px rgba(255,255,255, .1)' : 'none',
		opacity: isDraggingOver ? .7 : 1,
		background: isDraggingOver ? "#30353f" : "#282c34",
	});

	return (
		<section className={classes.services}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						style={getListStyle(snapshot.isDraggingOver)}>
						
						<Scrollbars
							style={{ height: '436px'}}
									autoHide
									autoHideTimeout={1000}
									autoHideDuration={200}>
							{cleanServices.length !== 0 ?
								cleanServices :
								<div className={classes.logoWrap}><div className={classes.logo}></div></div>}
						</Scrollbars>

						{provided.placeholder}
				</div>
				)}
		</Droppable>
    </section>
	)
};

export default Services;
