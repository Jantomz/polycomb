import React, { useEffect, useState } from "react";

const PDFViewer = ({ fileId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    // Construct the URL to fetch the PDF from the server
    const url = `http://localhost:8080/api/file/${fileId}`; // Adjust this URL based on your backend route

    setPdfUrl(url);
  }, [fileId]);

  return (
    <div>
      {pdfUrl ? (
        <iframe src={pdfUrl} width="100%" height="600px" title="PDF Viewer" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PDFViewer;
