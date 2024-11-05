"use client";

import React, { useState } from 'react';

const DashboardPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [downloadedVideos, setDownloadedVideos] = useState<string[]>([]);

  const handleGetInfo = async () => {
    // Replace with actual API call to get video info
    const info = await fetch(`/api/getVideoInfo?url=${encodeURIComponent(url)}`).then(res => res.json());
    setVideoInfo(info);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
        />
        <button onClick={handleGetInfo}>Get Info</button>
      </div>
      {videoInfo && (
        <div>
          <h2>Video Information</h2>
          <p>Title: {videoInfo.title}</p>
          <p>Description: {videoInfo.description}</p>
          {/* Add more video info as needed */}
        </div>
      )}
      <div>
        <h2>Downloaded Videos</h2>
        <ul>
          {downloadedVideos.map((video, index) => (
            <li key={index}>{video}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;