import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EditProduct from '../../features/product/allProduct/editProduct'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Product | All Product | Edit Product |" }))
      }, [])


    return(
        < EditProduct />
    )
}

export default InternalPage