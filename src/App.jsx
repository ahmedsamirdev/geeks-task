import { useMemo, useCallback, useRef, useState } from "react";
import "./App.css";
import bin from "./assets/bin.svg";
import duplicate from "./assets/duplicate.svg";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function App() {
  const gridRef = useRef();
  var aggCallCount = 0;
  var compareCallCount = 0;
  var filterCallCount = 0;

  const [rowData] = useState([
    {
      id: "1",
      name: "David ",
      last_name: "Celica",
      status: "Available",
      actions: "good",
    },
    {
      id: "2",
      name: "Yuliya ",
      last_name: "Pendleton",
      status: "Busy",
      actions: "good",
    },
    {
      id: "3",
      name: "Celica",
      last_name: "Ruolin",
      status: "Available",
      actions: "good",
    },
    {
      id: "4",
      name: "Chen ",
      last_name: "Boudia",
      status: "Available",
      actions: "good",
    },
    {
      id: "5",
      name: "Anne ",
      last_name: "Grégory ",
      status: "Available",
      actions: "good",
    },
  ]);

  const [columnDefs] = useState([
    {
      field: "",
      maxWidth: 50,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },
    { field: "id" },
    { field: "name" },
    { field: "last_name" },
    { field: "status" },
    { field: "actions", colId: "params", cellRenderer: cellRenderer },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  function cellRenderer() {
    // 4.a delete one row
    const handleDelete = useCallback(() => {
      const selectedData = gridRef.current.api.getSelectedRows();
      gridRef.current.api.applyTransaction({ remove: selectedData });
    }, [rowData]);

    const timeOperation = (name, operation) => {
      aggCallCount = 0;
      compareCallCount = 0;
      filterCallCount = 0;
      operation();
    };

    let newCount = 2;
    const duplicateRowData = () => {
      var api = gridRef.current.api;
      // get the first child of the
      var selectedRows = api.getSelectedRows();
      const newData = {
        id: newCount + new Date().getTime().toString().slice(-2),
        name: selectedRows[0].name,
        last_name: selectedRows[0].last_name,
        status: selectedRows[0].status,
        actions: selectedRows[0].actions,
      };
      newCount++;
      return newData;
    };

    // 4.b duplicate one row
    const handleDuplicate = useCallback(() => {
      var api = gridRef.current.api;
      // get the first child of the
      var selectedRows = api.getSelectedRows();
      if (!selectedRows || selectedRows.length === 0) {
        return;
      }
      var newItems = [];
      selectedRows.forEach(function (selectedRow) {
        var newItem = duplicateRowData(
          selectedRow.id,
          selectedRow.name,
          selectedRow.last_name,
          selectedRow.status,
          selectedRow.actions
        );
        newItems.push(newItem);
      });
      timeOperation("Duplicate", function () {
        api.applyTransaction({ add: newItems });
      });
    }, [duplicateRowData]);

    return (
      <span>
        <img
          onClick={() => handleDuplicate()}
          src={duplicate}
          className="duplicate"
          style={{ width: 20 }}
          alt="duplicate"
        />
        <img
          src={bin}
          onClick={() => handleDelete()}
          className="delete"
          style={{ width: 20 }}
          alt="delete"
        />
      </span>
    );
  }

  // 3.a adds one row
  let newCount = 1;
  const createNewRowData = () => {
    const newData = {
      id: "1" + newCount,
      name: "New value added",
      last_name: "Testing",
      status: "Available",
      actions: "good",
    };
    newCount++;
    return newData;
  };
  const addRow = useCallback((addIndex) => {
    const newItems = [createNewRowData()];
    const res = gridRef.current.api.applyTransaction({
      add: newItems,
      addIndex: addIndex,
    });
  }, []);

  // 3.b remove selected rows
  const onRemoveSelected = useCallback(() => {
    const selectedData = gridRef.current.api.getSelectedRows();
    const res = gridRef.current.api.applyTransaction({ remove: selectedData });
  }, []);

  const getRowId = useCallback((params) => {
    return params.data.id;
  }, []);

  return (
    <div className="App">
      <div style={{ marginBottom: "10px" }}>
        <button onClick={onRemoveSelected}>Remove Selected</button>
        <button onClick={() => addRow(0)}>Add Row</button>
      </div>

      <div className="ag-theme-alpine-dark" style={{ height: 400, width: 600 }}>
        <AgGridReact
          ref={gridRef}
          rowSelection={"multiple"}
          rowData={rowData}
          getRowId={getRowId}
          animateRows={true}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
}

export default App;
