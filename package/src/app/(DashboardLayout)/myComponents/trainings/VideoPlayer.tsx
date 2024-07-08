import { Box } from '@mui/material';
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

// Helper function to convert the YouTube URL
const convertToEmbedUrl = (url: string): string => {
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get('v');
  return `https://www.youtube.com/embed/${videoId}?si=J8JYjWZdeJYZs59g`;
};

const VideoPreview: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const embedUrl = convertToEmbedUrl(videoUrl);
  
  return (
    <Box px={6}>
        <iframe
            width="100%"
            height="500"
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
    </Box>
    
  );
};

export default VideoPreview;
