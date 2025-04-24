import { useState } from 'react'
import { MyRoutes } from './routers/routes'

function App(){
  const [count, setCount] = useState(0);

  return(
    <>
    <MyRoutes/>
    </>
  );
}

export default App;