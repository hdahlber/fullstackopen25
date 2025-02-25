const Notification = ({ message, isError }) => {
    if (message === null) {
      return null;
    }
  
    return (
      <div className={isError ? 'error' : 'success'}>
        {message}
        {isError}
      </div>
    )
  }
  
  export default Notification