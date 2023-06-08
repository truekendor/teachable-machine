import { useEffect, useRef } from "react";

export default function LoaderCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>();
    const animationId = useRef<number>();

    const distanceThreshold = 1;
    const angle1 = useRef(0);
    const angle2 = useRef(Math.PI + 0.5);

    const angle1Speed = useRef(0.15);
    const angle2Speed = useRef(0.03);

    useEffect(() => {
        canvasRef.current.width = 100;
        canvasRef.current.height = 100;

        animate();

        return () => {
            cancelAnimationFrame(animationId.current);
        };
    });

    function animate() {
        if (!canvasRef.current) return;
        const c = canvasRef.current.getContext("2d");
        const angleDistance = Math.abs(angle1.current - angle2.current);

        // * loader styles
        c.strokeStyle = "white";
        c.lineCap = "round";
        c.lineWidth = 12;

        // * loader logic
        c.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        c.beginPath();
        c.arc(
            canvasRef.current.width / 2,
            canvasRef.current.height / 2,
            canvasRef.current.width / 2 - c.lineWidth,
            angle1.current,
            angle2.current
        );

        c.stroke();
        c.closePath();

        angle1.current += angle1Speed.current;
        angle2.current += angle2Speed.current;

        // * swaps speed if
        // * distance < 0 + threshold OR
        // * distance > 2*PI - threshold
        if (angleDistance < distanceThreshold) {
            // prettier-ignore
            [angle1Speed.current, angle2Speed.current] = 
            [angle2Speed.current, angle1Speed.current];
        } else if (
            // prettier-ignore
            (angleDistance > (Math.PI * 2 - distanceThreshold)) &&
            (angle1Speed.current < angle2Speed.current)
        ) {
            // prettier-ignore
            [angle1Speed.current, angle2Speed.current] = 
            [angle2Speed.current, angle1Speed.current];
        }
        animationId.current = requestAnimationFrame(animate);
    }

    return <canvas ref={canvasRef}></canvas>;
}
