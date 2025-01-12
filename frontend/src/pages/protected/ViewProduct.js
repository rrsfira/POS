import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ProductDetail from '../../features/product/allProduct/detailProduct'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Product | All Product | Detail Product |" }))
      }, [])


    return(
        < ProductDetail />
    )
}

export default InternalPage