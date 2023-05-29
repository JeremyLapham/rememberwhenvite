import { useState, useRef } from "react";
import swal from "sweetalert";
import pako from 'pako';

const mimeType = "audio/webm";


const AudioRecorder = (props: any) => {

    const [permission, setPermission] = useState(false);
    const mediaRecorder: any = useRef<MediaStream | null>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [recordings, setRecordings] = useState([]);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData: any = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setStream(streamData);
                setPermission(true);

                const recordingsData = localStorage.getItem("recordings");
                if (recordingsData) {
                    const recordingsArray = JSON.parse(recordingsData);
                    setRecordings(recordingsArray);
                }
            } catch (err: any) {
                alert(err.message);
            }
        } else {
            swal("The MediaRecorder API is not supported in your browser.");
        }
    };


    const startRecording = async () => {
        if (stream) {
            setRecordingStatus("recording");
            const media: any = new MediaRecorder(stream, { mimeType });
            mediaRecorder.current = media;
            mediaRecorder.current.start();
            let localAudioChunks: any = [];
            mediaRecorder.current.ondataavailable = (event: any) => {
                if (typeof event.data === "undefined") return;
                if (event.data.size === 0) return;
                localAudioChunks.push(event.data);
            };
            setAudioChunks(localAudioChunks);
        }
    };

    // const compressAudioData = (audioData: any) => {
    //     const compressedData = pako.deflate(audioData);
    //     return compressedData;
    // };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioChunks([]);

            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64String = reader.result;
                const newRecordings: any = [...recordings, audioUrl];
                setRecordings(newRecordings);
                props.setaudio(base64String)
                // const compressedData = compressAudioData(base64String);
                // console.log(compressedData);
                console.log(base64String)
            };
        };
    };


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
            {props.audio === '' ?
                null
                :
                <div className="audio-player">
                    <audio src={props.audio} controls></audio>
                    <a download href={props.audio}>
                        Download Recording
                    </a>
                </div>}
        </div>
    );
};
export default AudioRecorder;