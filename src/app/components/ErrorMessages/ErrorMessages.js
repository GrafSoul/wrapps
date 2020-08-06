import React from 'react';

import classes from './errormessages.module.scss';

const ErrorMessages = ({ isError, setIsError }) => {
	return (
		<>
			{isError &&
				<p
					onMouseUp={() => setIsError(false)}
					className={classes.error}>
					{isError}
			</p>
		}
		</>
	)
};

export default ErrorMessages;
