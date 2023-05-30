import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import CryptoJS from "crypto-js";
import UserList from "./UserList";
import DownloadUsers from "./DownloadUsers";
import * as XLSX from "xlsx";

const App = () => {
  const [userList, setUserList] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(
    "U33038C9E4B0C4CBF6D7929C04348CBE1"
  );

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=20")
      .then((response) => response.json())
      .then((data) => {
        const modifiedUserList = data.results.map((user) => ({
          ...user,
          blocked: false,
        }));
        setUserList(modifiedUserList);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleBlockUser = (index) => {
    setUserList((prevUserList) => {
      const updatedUserList = [...prevUserList];
      updatedUserList[index].blocked = true;
      return updatedUserList;
    });
  };

  const handleUnblockUser = (index) => {
    setUserList((prevUserList) => {
      const updatedUserList = [...prevUserList];
      updatedUserList[index].blocked = false;
      return updatedUserList;
    });
  };

  const handleDeleteUser = (index) => {
    setUserList((prevUserList) => {
      const updatedUserList = [...prevUserList];
      updatedUserList.splice(index, 1);
      return updatedUserList;
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleDownloadDecryptedData = () => {
    if (!uploadedFile) {
      console.log("No file uploaded");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const fileData = event.target.result;
      const decryptedData = CryptoJS.AES.decrypt(
        fileData,
        encryptionKey
      ).toString(CryptoJS.enc.Utf8);
      const parsedData = JSON.parse(decryptedData);
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(parsedData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");
      const excelData = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileFormat = "xlsx";
      const excelDataBlob = new Blob([excelData], {
        type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
      });
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
      const filename = `decrypted-data-${timestamp}.${fileFormat}`;
      saveAs(excelDataBlob, filename);
    };
    reader.readAsText(uploadedFile);
  };

  const handleEncryptionKeyChange = (event) => {
    setEncryptionKey(event.target.value);
  };
  if (userList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>File Upload and Decryption</h1>
        <input type="file" onChange={handleFileUpload} />
        <br />
        <input
          type="text"
          placeholder="Enter Key"
          value={encryptionKey}
          onChange={handleEncryptionKeyChange}
        />
        <br />
        <button onClick={handleDownloadDecryptedData}>
          Download Decrypted Data
        </button>
      </div>
      <UserList
        userList={userList}
        onBlockUser={handleBlockUser}
        onUnblockUser={handleUnblockUser}
        onDeleteUser={handleDeleteUser}
      />
      <DownloadUsers userList={userList} />
    </div>
  );
};

export default App;
