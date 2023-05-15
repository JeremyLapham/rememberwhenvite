// import { useState, useEffect } from 'react';
// const MicRecorder = require('mic-recorder-to-mp3');

// const AudioRecorder = () => {
//     const [audioChunks, setAudioChunks] = useState([]);
//     const [recording, setRecording] = useState(false);
//     const [permission, setPermission] = useState(false);

//     let mediaRecorder: MediaRecorder | null = null;

//     useEffect(() => {
//         navigator.mediaDevices
//             .getUserMedia({ audio: true })
//             .then(() => {
//                 setPermission(true);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }, []);

//     const handleStart = () => {
//         if (!mediaRecorder) {
//             navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//                 mediaRecorder = new MediaRecorder(stream);

//                 mediaRecorder.addEventListener('dataavailable', (event:any) => {
//                     setAudioChunks([...audioChunks, event.data]);
//                 });

//                 mediaRecorder.start();
//                 setRecording(true);
//             });
//         } else {
//             mediaRecorder.start();
//             setRecording(true);
//         }
//     };

//     const handleStop = () => {
//         mediaRecorder?.stop();
//         setRecording(false);

//         const blob = new Blob(audioChunks, { type: 'audio/wav' });
//         const reader = new FileReader();

//         reader.onloadend = () => {
//             // Save the recorded audio to the database
//             const audioData = reader.result;
//             console.log(audioData);
//             // Code to save audioData to the database
//         };

//         reader.readAsDataURL(blob);
//     };

//     return (
//         <div>
//             {permission ? (
//                 <>
//                     <button onClick={handleStart} disabled={recording}>
//                         Start Recording
//                     </button>
//                     <button onClick={handleStop} disabled={!recording}>
//                         Stop Recording
//                     </button>
//                 </>
//             ) : (
//                 <p>Please allow access to your microphone.</p>
//             )}
//         </div>
//     );
// };

// export default AudioRecorder;