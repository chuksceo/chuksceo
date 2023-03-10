import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./DocumentViewer.scss";
import { useDispatch, useSelector } from "react-redux";
import { reportGet, shareDocs } from "./features/counterSlice";

function DocumentViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const documentName = useSelector(state => state.user.documentName)
  const patientData = useSelector(state => state.user.recentPatient);
  const userData = useSelector((state) => state.user.value);
  const patientUidFromDocNots = useSelector(state => state.user.patientDataForNotification)
  const [uploadData, setUploadData] = useState([])
  const history = useHistory();
  const dispatch = useDispatch()
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  { console.log(documentName) }
  useEffect(() => {
    async function getToUploadData() {
      const response = await fetch(`http://localhost:7000/report/toupload?id=${userData?.uId ?? patientData?.value ?? patientUidFromDocNots}&masterIdentifier=${documentName.filename.replace('.pdf', '')}`, {
        method: "GET"
      });
      const data = await response.json();

      console.log(data)
      setUploadData(data);
    }
    return getToUploadData();
  }, []);
  console.log(patientUidFromDocNots)
  return (
    <div className="documentViewer">
      <Document
        file={`http://localhost:7000/record?recordName=${documentName.filename.replace(".pdf",'').concat(".pdf")}&patientId=${userData?.uId ?? patientData?.value ?? patientUidFromDocNots}`}
        onLoadSuccess={onDocumentLoadSuccess}
        className="documentViewer__document"
      >
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => (
            <Page pageNumber={page} className="documentViewer__page" />
          ))}
      </Document>
      {console.log(patientData)}
      <div className={`documentViewer__share ${patientData && "documentViewer__shareNone"}`}
      onClick={()=>{dispatch(shareDocs(documentName));
      history.push("/home/shareDocuments")
      }}
      >Share</div>

      <div className="documentViewer__reports">
        <ul>
          {Object.keys(uploadData).map((key) => {
            return (
              <li key={key} onClick={async () => {
                const response = await fetch(`http://localhost:7000/report/checkreport?id=${userData?.uId ?? patientData?.value ?? patientUidFromDocNots}&masterId=${documentName.filename.replace('.pdf', '')}&reportId=${uploadData[key].value}`, {
                  method: "GET"
                })
                const data = await response.json();
                console.log(data);
                if (data.message === "report not available") {
                  dispatch(reportGet(uploadData[key]));
                  if (patientData) {
                    alert("No report available");
                  }
                  else {
                    history.push("/home/uploadReport");
                  }
                } else if (data.message === "report available") {
                  dispatch(reportGet(uploadData[key]));
                  if (patientData) {
                    history.push("/Doctor/reportView")
                  }
                  else {
                    history.push("/home/reportView")
                  }
                }
              }} key={key}>{uploadData[key].text}</li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}
export default DocumentViewer;
