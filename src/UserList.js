import React from "react";
import { useTable } from "react-table";

const UserList = ({ userList, onBlockUser, onUnblockUser, onDeleteUser }) => {
  const columns = React.useMemo(
    () => [
      { Header: "#", accessor: "index" },
      { Header: "ID", accessor: "id.value" },
      { Header: "Full Name", accessor: "fullName" },
      { Header: "Gender", accessor: "gender" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Date of Birth", accessor: "dob.date" },
      { Header: "Age", accessor: "dob.age" },
      { Header: "Location", accessor: "location" },
      { Header: "Nationality", accessor: "nat" },
      { Header: "Actions", accessor: "actions" },
    ],
    []
  );

  const data = userList.map((user, index) => ({
    index: index + 1,
    id: user.login.uuid,
    fullName: `${user.name.first} ${user.name.last}`,
    gender: user.gender,
    email: user.email,
    phone: user.phone,
    dob: {
      date: user.dob.date,
      age: user.dob.age,
    },
    location: `${user.location.street.number}, ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}`,
    nat: user.nat,
    actions: (
      <>
        <button onClick={() => onBlockUser(index)}>Block</button>
        <button onClick={() => onUnblockUser(index)}>Unblock</button>
        <button onClick={() => onDeleteUser(index)}>Delete</button>
      </>
    ),
  }));

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table {...getTableProps()} className="table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserList;
