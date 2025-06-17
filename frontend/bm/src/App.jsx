import { useState } from "react";
import "./App.css";
import axios from 'axios';

import * as XLSX from 'xlsx'

function App() {

  const [msg, setMsg] = useState("")
  const [sts, setSts] = useState(false)
  const [emaill, setEmaill] = useState([]);
  


const handlemsg = (e) => {
  setMsg(e.target.value);
}
  
  
  const handlefile = (e) => {


    const data = e.target.files[0];
    console.log(data);

    const reader = new FileReader();

    reader.onload = (e) => {
      const rvalue = e.target.result;
      const workbook = XLSX.read(rvalue, { type: "binary" });
      const sheetname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetname];
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
  const totalemaill = emaillist.map((dataemail,) => {
    return (dataemail.A)
  })
      
      setEmaill(totalemaill);
    };

    reader.readAsBinaryString(data);
    
  }
  const send = () => {
  setSts(true)
  axios
    .post("https://bulkmailapp-rs7i.onrender.com/sendmail", {
      data: msg,
      list: emaill,
    })
    .then((response) => {
      if (response.data == true) {
        alert("Email sent successfully");
      }
      console.log("Email sent successfully", response.data);
      setSts(false);
    })
    .catch((error) => {
      console.error("Error sending email", error);
    });
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-2">
          Bulk Mailer
        </h1>
        <p className="text-center text-gray-600 mb-6">
          We help you send your emails easily.
        </p>

        <label className="block text-gray-700 font-medium mb-2">
          Your Message
        </label>
        <textarea
          rows="5"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          placeholder="Enter your message here..."
          onChange={handlemsg}
          value={msg}
        />

        <label className="block text-gray-700 font-medium mb-2">
          Upload Excel File
        </label>
        <input
          onChange={handlefile}
          type="file"
          accept=".xlsx,.xls"
          className="w-full border border-gray-300 rounded-md p-2 mb-2"
        />

        <p className="text-sm text-gray-500 mb-4">
          Total emails: {emaill.length}
        </p>

        <button
          onClick={send}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          {sts ? "Sending...." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
