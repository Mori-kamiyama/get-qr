import React, { useState } from 'react';
import { QrData } from './types';
import './App.css'; // スタイルを別ファイルにインポート

function App() {
  const [username, setUsername] = useState("");
  const [qrDataList, setQrDataList] = useState<QrData[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMailIndex, setSelectedMailIndex] = useState<number | null>(null);

  const API_BASE_URL = "https://qr.toromino.net/qr";

  const handleFetch = async () => {
    if (!username.trim()) return;

    setQrDataList([]);
    setErrorMessage("");

    try {
      const url = `${API_BASE_URL}/${encodeURIComponent(username)}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setQrDataList(data);
      } else {
        throw new Error("取得データが配列ではありません");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "データ取得に失敗しました");
    }
  };

  const openMailDetail = (index: number) => {
    setSelectedMailIndex(index);
  };

  const closeMailDetail = () => {
    setSelectedMailIndex(null);
  };

  const goToPreviousMail = () => {
    if (selectedMailIndex !== null && selectedMailIndex > 0) {
      setSelectedMailIndex(selectedMailIndex - 1);
    }
  };

  const goToNextMail = () => {
    if (selectedMailIndex !== null && selectedMailIndex < qrDataList.length - 1) {
      setSelectedMailIndex(selectedMailIndex + 1);
    }
  };

  const selectedMail = selectedMailIndex !== null ? qrDataList[selectedMailIndex] : null;

  return (
      <div className="container">
        <h1 className="title">QR Data Fetcher (React+TS)</h1>
        <div className="form">
          <label className="label">
            ユーザー名:
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="ユーザー名を入力"
            />
          </label>
          <button onClick={handleFetch} className="button">
            データ取得
          </button>
        </div>

        {errorMessage && <div className="error">{errorMessage}</div>}

        {qrDataList.length > 0 && (
            <div className="table-container">
              <table className="qr-table">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Place</th>
                  <th>Person</th>
                  <th>Mail</th>
                  <th>QR-data</th>
                  <th>Subject</th>
                </tr>
                </thead>
                <tbody>
                {qrDataList.map((item, index) => (
                    <tr key={item.id} onClick={() => openMailDetail(index)} className="table-row">
                      <td>{item.id || 'N/A'}</td>
                      <td>{item.date || 'N/A'}</td>
                      <td>{item.place || 'N/A'}</td>
                      <td>{item.person || 'N/A'}</td>
                      <td>
                        {item.mail ? (
                            <a href={`mailto:${item.mail}`} className="mail-link">
                              {item.mail}
                            </a>
                        ) : (
                            'N/A'
                        )}
                      </td>
                      <td>{item["QR-data"] || 'N/A'}</td>
                      <td>{item.subject || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {selectedMail && (
            <div className="modal-overlay" onClick={closeMailDetail}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeMailDetail}>&times;</button>
                <div className="mail-details">
                  <h2>メール詳細</h2>
                  <p><strong>ID:</strong> {selectedMail.id || 'N/A'}</p>
                  <p><strong>Date:</strong> {selectedMail.date || 'N/A'}</p>
                  <p><strong>Place:</strong> {selectedMail.place || 'N/A'}</p>
                  <p><strong>Person:</strong> {selectedMail.person || 'N/A'}</p>
                  <p><strong>Mail:</strong> {selectedMail.mail ? (
                      <a href={`mailto:${selectedMail.mail}`} className="mail-link">
                        {selectedMail.mail}
                      </a>
                  ) : 'N/A'}</p>
                  <p><strong>QR-data:</strong> {selectedMail["QR-data"] || 'N/A'}</p>
                  <p><strong>Subject:</strong> {selectedMail.subject || 'N/A'}</p>
                </div>
                <div className="navigation-buttons">
                  <button onClick={goToPreviousMail} disabled={selectedMailIndex === 0} className="nav-button">
                    &#8592; 前へ
                  </button>
                  <button onClick={goToNextMail} disabled={selectedMailIndex === qrDataList.length - 1} className="nav-button">
                    次へ &#8594;
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default App;