import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import DetailTransfer from '../../features/warehouse/detailTransfer'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Warehouse | All Transfer | Detail Transfer"}))
      }, [])


    return(
        < DetailTransfer />
    )
}

export default InternalPage