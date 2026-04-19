import IndexSlots from './components/slots/IndexSlots'
import { useState } from 'react'
import IndexTable from './components/table/IndexTable'
import IndexDemo from './components/demo/IndexDemo'

export default function App() {
    const [index, setIndex] = useState('slot')
    function change(val) {
        setIndex(val)
    }

    const screens = {
        slot: <IndexDemo />,
        slots: <IndexSlots />,
        table: <IndexTable />,
      } as const

    return(
        <>
         <button onClick={() => change('slot')}>Slot</button>
         <button onClick={() => change('slots')}>Slots</button>
         <button onClick={() => change('table')}>Table</button>
         <br />
        {screens[index]}
       
        </>

    )
}