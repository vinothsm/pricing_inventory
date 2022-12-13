// import 'react-data-grid/lib/styles.css';
// import DataGrid from 'react-data-grid';
import axios from 'axios';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {toast} from 'react-toastify'


import { getPricingRecords, getAllPricingRecords, filterPricingRecords, reset } from '../features/pricing/pricingSlice';
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
    filter: textFilter(),
    editable: true
  },
  {
    dataField: 'product_name',
    text: 'product_name',
    filter: textFilter({className:"ff"}),
    editable: true
  },
  {
    dataField: 'price',
    text: 'price',
    filter: textFilter(),
    editable: true
  },
  {
    dataField: 'date',
    text: 'date',
    filter: textFilter(),
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
      filterPosition="top"
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
    const filterString = Object.keys(filter).map((key) => {
      if (filter[key].filterVal) {
        return `${key}=${filter[key].filterVal}`;
      }
      return null;
    }).filter((f) => f).join('&');
    console.log(filterString);

    // const response = await axios.get(`https://jsonplaceholder.typicode.com/comments?${filter}`)
    // setData(response.data);
    dispatch(filterPricingRecords(filterString))

  }

  // handle cell edit
  const handleCellEdit = async(cellEdit) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataUpdate = {"sku":cellEdit.rowId}
      dataUpdate["data"] = {[cellEdit.dataField]:cellEdit.newValue}
      const response = await axios.post("http://localhost:8200/pricing/update_pricing_records", dataUpdate, config)

      toast.success(response.message);
    } catch (err) {
      if (err.response.status === 500) {
        toast.error('There was a problem with the server');
      } else {
        toast.error(err.response.data.message);
      }
    }
  }


  
  const handleTableChange = (type, { filters, cellEdit, page, sizePerPage }) => {

    if (type === 'pagination') {
      handlePagination(page, sizePerPage);
    }
    else if (type === 'cellEdit') {
      handleCellEdit(cellEdit);
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