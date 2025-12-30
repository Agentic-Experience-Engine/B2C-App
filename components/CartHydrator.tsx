// 'use client'

// import { useEffect } from 'react'
// import { store } from '@/lib/store'

// const CartHydrator = () => {
//   const hydrateCartFromDB = store((s) => s.hydrateCartFromDB)

//   useEffect(() => {
//     // On first client render, try to restore cart from DB (if logged in)
//     hydrateCartFromDB()
//   }, [hydrateCartFromDB])

//   return null
// }

// export default CartHydrator
'use client'

import { useEffect } from 'react'
import { store } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'

const CartHydrator = () => {
  const hydrateCartFromDB = store((s) => s.hydrateCartFromDB)

  useEffect(() => {
    const supabase = createClient()

    const hydrate = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        await hydrateCartFromDB()
      }
    }

    hydrate()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        hydrateCartFromDB()
      }
    })

    return () => subscription.unsubscribe()
  }, [hydrateCartFromDB])

  return null
}

export default CartHydrator
