import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeDown, FaHeart, FaEllipsisV, FaMusic } from 'react-icons/fa';

const audioFiles = [
  { src: 'src/Clarx - Shakedown [NCS Release].mp3', name: 'Shakedown', logo: 'src/mlogo.png',alt: 'Music', liked: false }, // Replace with your audio file URLs and logos
  { src: 'src/ambikapathi.mp3', name: 'Ambikapathi', logo: 'src/music.png',alt: 'Music',liked: false },
  { src: 'src/navya audio.mp3', name: 'jigurtha dhanga', logo: 'src/mlogo.png',alt: 'Music',liked: false },
  { src: 'src/dream.mp3', name: 'Dream', logo: 'src/headphone.jpeg' ,alt: 'Music', liked: false},

  { src: 'src/mannarkudi.mp3', name: 'Mannar Kudi', logo: 'src/headphone.jpeg', alt: 'Music',liked: false },
  { src: 'src/Midranger - Apocalypse [NCS Release].mp3', name: 'Apocalypse', logo: 'src/music.png', alt: 'Music',liked: false },
  { src: 'src/Heuse & Tom Wilson - Ignite [NCS Release].mp3', name: 'Ignite', logo: 'src/mlogo.png',alt: 'Music', liked: false },
  { src: 'src/N3WPORT - Alive (feat. Neoni) [NCS Release].mp3', name: 'Alive', logo: 'src/headphone.jpeg', alt: 'Music',liked: false }
];

const App = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [queue, setQueue] = useState([]);
  const [showQueue, setShowQueue] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); 
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const playTrack = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playPrevious = () => {
    setCurrentTrack((prev) => (prev === 0 ? audioFiles.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const playNext = () => {
    setCurrentTrack((prev) => (prev === audioFiles.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  const volumeUp = () => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(audioRef.current.volume + 0.1, 1);
    }
  };

  const volumeDown = () => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(audioRef.current.volume - 0.1, 0);
    }
  };

  const createPlaylist = () => {
    if (newPlaylistName) {
      setPlaylists([...playlists, { id: playlists.length + 1, name: newPlaylistName, tracks: [] }]);
      setNewPlaylistName('');
    }
  };

  const addToPlaylist = (trackId, playlistId) => {
    const playlistToUpdate = playlists.find((playlist) => playlist.id === playlistId);
    if (playlistToUpdate) {
      const updatedTracks = [...playlistToUpdate.tracks, audioFiles.find((track) => track.id === trackId)];
      const updatedPlaylists = playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, tracks: updatedTracks };
        } else {
          return playlist;
        }
      });
      setPlaylists(updatedPlaylists);
    }
  };

  const addToQueue = (trackId) => {
    const trackToAdd = audioFiles.find((track) => track.id === trackId);
    if (trackToAdd) {
      setQueue([...queue, trackToAdd]);
    }
  };

  const likeTrack = (trackId) => {
    const updatedAudioFiles = audioFiles.map((track) =>
      track.id === trackId ? { ...track, liked: !track.liked } : track
    );
    setCurrentTrack((prev) => (prev === trackId - 1 ? trackId - 1 : prev));
  };

  const filteredTracks = audioFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="audio-player">
      <div className="background"></div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a song"
        className="search-bar"
      />
      <div className="track-list">
        {filteredTracks.map((file, index) => (
          <div key={file.id} className={`track-item ${currentTrack === index ? 'active' : ''}`} onClick={() => playTrack(index)}>
            <img src={file.logo} alt={`${file.name} logo`} className="track-logo" />
            <span>{file.name}</span>
            <button className="icon-button" onClick={(e) => { e.stopPropagation(); likeTrack(file.id); }}>
              <FaHeart className={file.liked ? 'liked' : ''} />
            </button>
            <div className="menu" onClick={(e) => e.stopPropagation()}>
              <FaEllipsisV />
              <div className="menu-content">
                <button onClick={() => addToPlaylist(file.id, currentPlaylist)}>Add to Playlist</button>
                <button onClick={() => addToQueue(file.id)}>Add to Queue</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <audio ref={audioRef} src={audioFiles[currentTrack].src} />
      <div className="controls">
        <button onClick={playPrevious}><FaStepBackward /></button>
        <button onClick={togglePlayPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
        <button onClick={playNext}><FaStepForward /></button>
        <button onClick={volumeUp}><FaVolumeUp /></button>
        <button onClick={volumeDown}><FaVolumeDown /></button>
        <button onClick={() => setShowQueue(!showQueue)}><FaMusic /></button>
        <div className="current-time">{formatTime(currentTime)} / {formatTime(duration)}</div>
      </div>
      {showQueue && (
        <div className="queue">
          <h3>Queue</h3>
          {queue.map((track) => (
            <div key={track.id} className="queue-item">
              <img src={track.logo} alt={`${track.name} logo`} className="track-logo" />
              <span>{track.name}</span>
            </div>
          ))}
        </div>
      )}
      <div className="playlist-section">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New Playlist Name"
        />
        <button onClick={createPlaylist}>Create Playlist</button>
        <div className="playlists">
          {playlists.map((playlist) => (
            <div key={playlist.id} onClick={() => setCurrentPlaylist(playlist.id)} className="playlist-item">
              {playlist.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;






