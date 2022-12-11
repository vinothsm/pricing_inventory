// import 'react-data-grid/lib/styles.css';
// import DataGrid from 'react-data-grid';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { getPricingRecords, getAllPricingRecords, reset } from '../features/pricing/pricingSlice';
import Spinner from '../components/Spinner'
import FileUpload from "../components/FileUpload";

const columns = [
  {
    dataField: 'store_id',
    text: 'store_id',
    filter: textFilter(),
    sort: true
  },
  {
    dataField: 'sku',
    text: 'sku',
    editable: true
  },
  {
    dataField: 'product_name',
    text: 'product_name',
    editable: true
  },
  {
    dataField: 'price',
    text: 'price',
    editable: true
  },
  {
    dataField: 'date',
    text: 'date',
    editable: true
  }
];

const cellEditProps = {
  mode: 'dbclick',
  blurToSave: true,
  nonEditableRows: () => [1]

};


const RemotePagination = ({ data, page, sizePerPage, onTableChange, totalSize }) => (
  <div>
    <BootstrapTable
      remote
      keyField="sku"
      data={ data }
      columns={ columns }
      filter={ filterFactory() }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      cellEdit={ cellEditFactory(cellEditProps) }
      onTableChange={ onTableChange }
    />
  </div>
);

function Dashboard() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [page, setPage] = useState(1)
  const { user } = useSelector((state) => state.auth)

  const {isLoading, isError, message, data, sizePerPage, totalSize} = useSelector((state) => state.pricing)

  useEffect(() => {
    if (isError) {
      console.log(message)
    }
    
    if (!user) {
      navigate('/login')
    }

    if(user){
      dispatch(getAllPricingRecords())
    }

    return () => {
      dispatch(reset())
    }

  }, [user, navigate, isError, message, dispatch])


  const handlePagination = async(page, sizePerPage) => {
    const currentIndex = (page - 1) * sizePerPage;
    setPage(page)
    // getData(currentIndex, currentIndex + sizePerPage).then((res) => {
    //   setData(JSON.parse(res));
    // });
    // setSizePerPage(sizePerPage)

    dispatch(getPricingRecords({_start:currentIndex, _limit:sizePerPage}))
  }

  // handle filter
  const handleFilter = async(filter) => {
    console.log(filter);
    // const response = await axios.get(`https://jsonplaceholder.typicode.com/comments?${filter}`)
    // setData(response.data);
  }

  // handle cell edit
  const handleCellEdit = async(cellEdit) => {
    console.log(cellEdit);
    // const response = await axios.put(`https://jsonplaceholder.typicode.com/comments/${cellEdit.rowId}`, cellEdit)
    // console.log(response);
    // done();
  }


  
  const handleTableChange = (type, { filters, cellEdit, page, sizePerPage }) => {

    if (type === 'pagination') {
      handlePagination(page, sizePerPage);
    }
    else if (type === 'cellEdit') {
      console.log('====================================');
      console.log('cellEdit', cellEdit);
      handleCellEdit(cellEdit);
      console.log('====================================');
    }
    else if (type === 'filter') {
      console.log('====================================');
      console.log('filter', filters);
      handleFilter(filters);
      console.log('====================================');
    }
  }
  
  if(isLoading) {
    return <Spinner />
  }

  return (
    <>
      {/* <BootstrapTable keyField = 'id' data={data} columns = {columns}
        // remote
        striped
        pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
        cellEdit={cellEditFactory({ 
          mode: 'dbclick',
          blurToSave: true,
          nonEditableRows: () => [1]
        })}
        filter={filterFactory()}
        onTableChange={ handleTableChange }

      /> */}
      <FileUpload />

      <RemotePagination
        data={ data }
        page={ page }
        sizePerPage={ sizePerPage }
        onTableChange={ handleTableChange }
        totalSize={ totalSize }
      />
    </>
  )
}


export default Dashboard