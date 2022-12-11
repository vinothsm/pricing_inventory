import axios from "axios";
import { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

function Db() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    axios("https://jsonplaceholder.typicode.com/comments").then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  };

  const columns = [
    {
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "postId",
      text: "Product ID",
      filter: textFilter(),
      sort: true,
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      editable: true,
    }
  ];
  return (
    <div className="App">
      <BootstrapTable
        remote
        keyField="id"
        data={data}
        columns={columns}
        striped
        hover
        condensed
        pagination={paginationFactory()}
        cellEdit={cellEditFactory({
          mode: "dbclick",
          blurToSave: true,
          nonEditableRows: () => [1, 2, 3],
        })}
        filter={filterFactory()}
      />
    </div>
  );
}

export default Db
