// import React, { useEffect, useState } from "react";
// import { useCheetah } from "@picovoice/cheetah-react";


// export default function CheetahFrontend() {
//     const [transcript, setTranscript] = useState("");

//     const {
//         result,
//         isLoaded,
//         isListening,
//         error,
//         init,
//         start,
//         stop,
//     } = useCheetah();


//     const initEngine = async () => {
//         await init(
//             process.env.REACT_APP_ACCESS_KEY,
//             { publicPath: '/model/cheetah_params.pv' },
//             { enableAutomaticPunctuation: true }
//         );
//     };

//     // const initEngine = async () => {
//     //     try {
//     //         await init(
//     //             process.env.REACT_APP_ACCESS_KEY,
//     //             { publicPath: process.env.REACT_APP_MODEL_FILE_PATH },
//     //             { enableAutomaticPunctuation: true }
//     //         );
//     //     } catch (err) {
//     //         console.error("Initialization error:", err);
//     //     }
//     // };

//     const toggleRecord = async () => {
//         if (isListening) {
//             await stop();
//         } else {
//             await start();
//         }
//     };

//     useEffect(() => {
//         if (result !== null) {
//             setTranscript(prev => {
//                 let newTranscript = prev + result.transcript
//                 if (result.isComplete) {
//                     newTranscript += " "
//                 }
//                 return newTranscript
//             })
//         }
//     }, [result])

//     return (
//         <div>
//             {error && <p className="error-message">{error.toString()}</p>}
//             <br />
//             <button onClick={initEngine} disabled={isLoaded}>Initialize Cheetah</button>
//             <br />
//             <br />
//             <label htmlFor="audio-record">Record audio to transcribe:</label>
//             <button id="audio-record" onClick={toggleRecord} disabled={!isLoaded}>
//                 {isListening ? "Stop Listening" : "Start Listening"}
//             </button>
//             <h3>Transcript:</h3>
//             <p>{transcript}</p>
//         </div>
//     );
// }


import React, { useEffect } from "react";
import { useCheetah } from "@picovoice/cheetah-react";


function CheetahFrontend(props) {
    const {
        result,
        isLoaded,
        isListening,
        error,
        init,
        start,
        stop,
        release,
    } = useCheetah();


    const cheetahModel = { publicPath: '/model/cheetah_params.pv' };

    useEffect(() => {
        init(
            process.env.REACT_APP_ACCESS_KEY,
            cheetahModel
        );
    }, []);


    useEffect(() => {
        if (result !== null) {
            // ... use transcript result
        }
    }, [result]);

    useEffect(() => {
        return () => {
            release();
        };
    }, []);


    return (
        <div>
            {isLoaded ? (
                <div>
                    <button onClick={start} disabled={isListening}>Start</button>
                    <button onClick={stop} disabled={!isListening}>Stop</button>
                    <p>{isListening ? "Listening..." : "Not Listening"}</p>
                    {result && <p>Transcript: {result}</p>}
                </div>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p>Error: {error.message}</p>}
        </div>
    );

}

export default CheetahFrontend