import { useState, useRef, useEffect,useContext } from "react";
import { useCol } from "react-bootstrap/esm/Col";
import { MyContext } from "../context";

const mimeType = "audio/webm";


const AudioRecorder = () => {
    const userData = useContext(MyContext)

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [recordings, setRecordings] = useState([]);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);

                const recordingsData = localStorage.getItem("recordings");
                if (recordingsData) {
                    const recordingsArray = JSON.parse(recordingsData);
                    setRecordings(recordingsArray);
                }
            } catch (err: any) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };


    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks: any = [];
        mediaRecorder.current.ondataavailable = (event: any) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            //creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(audioBlob);
            userData.setAudio(audioUrl);
            setAudioChunks([]);

            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64String = reader.result;
                const newRecordings = [...recordings, audioUrl];
                setRecordings(newRecordings);
                //save to local storage
                localStorage.setItem("audioRecording", base64String);
            };
        };
    };

    useEffect(() => {
        const savedAudio = localStorage.getItem("audioRecording");
        if (savedAudio) {
            //convert base64-encoded string to blob
            const byteString = atob(savedAudio.split(",")[1]);
            const mimeString = savedAudio.split(",")[0].split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const audioBlob = new Blob([ab], { type: mimeString });
            const audioUrl = URL.createObjectURL(audioBlob);
            userData.setAudio(audioUrl);
        }
    }, []);


    return (
        <div>
            <div className="audio-controls">
                {!permission ? (
                    <button onClick={getMicrophonePermission} type="button">
                        Get Microphone
                    </button>
                ) : null}
                {permission && recordingStatus === "inactive" ? (
                    <button onClick={startRecording} type="button">
                        Start Recording
                    </button>
                ) : null}
                {recordingStatus === "recording" ? (
                    <button onClick={stopRecording} type="button">
                        Stop Recording
                    </button>
                ) : null}
            </div>
            {userData.audio ? (
                <div className="audio-player">
                    <audio src={userData.audio} controls></audio>
                    <a download href={userData.audio}>
                        Download Recording
                    </a>
                </div>
            ) : null}
        </div>
    );
};
export default AudioRecorder;