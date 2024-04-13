import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urlToDelete, setUrlToDelete] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setShortUrl(data.shortUrl);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const id = urlToDelete.split("/").pop(); // Extract ID from URL
    const response = await fetch(`${process.env.REACT_APP_API_URL}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("URL deleted successfully.");
      setUrlToDelete("");
    } else {
      alert("Failed to delete URL.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL here..."
          required
        />
        <button type="submit">Shorten URL</button>
      </form>
      {shortUrl && (
        <p>
          Shortened URL:{" "}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </p>
      )}

      <form onSubmit={handleDelete}>
        <input
          type="text"
          value={urlToDelete}
          onChange={(e) => setUrlToDelete(e.target.value)}
          placeholder="Enter URL to delete..."
          required
        />
        <button style={{ background: "crimson" }} type="submit">
          Delete URL
        </button>
      </form>
    </div>
  );
}

export default App;
