import {
    Application,
} from '@pixi/react';

import { MageCard } from './MageCard'

export default function IndexTable() {
    return(
    <Application
        backgroundColor="gray"
        width={800}
        height={600}
        defaultTextStyle={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}
    >
        <MageCard />
     </Application>
    )
}