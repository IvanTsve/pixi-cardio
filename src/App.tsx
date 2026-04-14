import IndexSlots from './components/slots/IndexSlots'
import { useState } from 'react'
import IndexTable from './components/table/IndexTable'

export default function App() {
    const [index, setIndex] = useState('table')
    function change(val) {
        setIndex(val)
    }

    return(
        <>
         <button onClick={() => change('slot')}>Slot</button>
         <button onClick={() => change('table')}>Table</button>
         <br />
        {index === 'slot' ? <IndexSlots/> : <IndexTable/>}
       
        </>

    )
}