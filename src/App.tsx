import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "./components/webcam/Webcam";
import Card from "./components/card/Card";

import "./index.css";

function App() {
    const [status, setStatus] = useState("waiting for model to load...");
    const MOBILE_NET_INPUT_WIDTH = 224;
    const MOBILE_NET_INPUT_HEIGHT = 224;
    const model = useRef<tf.Sequential>(tf.sequential());
    const mobilenet = useRef<tf.GraphModel>();
    const mock = [1, 2, 3];

    useEffect(() => {
        loadMobileNetFeatureModel();

        model.current.add(
            tf.layers.dense({
                inputShape: [1024],
                units: 128,
                activation: "relu",
            })
        );
        model.current.add(
            tf.layers.dense({
                inputShape: [2],
                units: 128,
                activation: "softmax",
            })
        );
        model.current.summary();

        // model.compile({
        // 	optimizer: "adam",
        // 	loss: CLASS_NAMES === 2 ? "binaryCrossentropy" : "categoricalCrossentropy",
        // 	metrics: ["accuracy"],
        // });
    });

    async function loadMobileNetFeatureModel() {
        const URL =
            "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1";
        let result = await tf.loadGraphModel(URL, { fromTFHub: true });
        mobilenet.current = result;

        setStatus("MobileNet v3 loaded successfully");
        tf.tidy(() => {
            let answer = mobilenet.current.predict(
                // !         batch_size, y, x, 3
                tf.zeros([
                    1,
                    MOBILE_NET_INPUT_HEIGHT,
                    MOBILE_NET_INPUT_WIDTH,
                    3,
                ])
            );
            // @ts-ignore
            // console.log(answer.shape); // [batch_size -> default == 1, 1024]
        });
    }

    return (
        <div className="App">
            <header>TEACHABLE MACHINE CLONE WITH REACT TYPESCRIPT</header>
            <div>{status}</div>
            {mock.map((el, index) => {
                return <Card key={index} queue={index} />;
            })}
        </div>
    );
}

export default App;
