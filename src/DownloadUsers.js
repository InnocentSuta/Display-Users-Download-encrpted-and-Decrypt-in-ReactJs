import React from "react";
import { AES } from "crypto-js";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const DownloadUsers = ({ userList }) => {
  const handleDownload = (format) => {
    const encryptionKey = "Key";
    const encryptedData = AES.encrypt(
      JSON.stringify(userList),
      encryptionKey
    ).toString();

    if (format === "xls") {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet([{ encryptedData }]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "encrypted_user_data.xlsx");
    } else if (format === "csv") {
      const csvContent = "data:text/csv;charset=utf-8," + encryptedData;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "encrypted_user_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <button onClick={() => handleDownload("xls")}>Download as XLS</button>
      <button onClick={() => handleDownload("csv")}>Download as CSV</button>
    </>
  );
};

export default DownloadUsers;
