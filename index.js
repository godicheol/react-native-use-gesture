import { PanResponder } from 'react-native';

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
}
function getDegree(cx, cy, x, y) {
    let rad = Math.atan2(x-cx, y-cy);
    if (rad < 0) {
        rad += 2*Math.PI;
    }
    return rad*180/Math.PI;
}
function setDegree(deg) {
    return ((deg % 360) + 360) % 360;
}
function useGesture() {
    const callbacks = {
        start: null,
        end: null,
        tap: null,
        press: null,
        swipe: null,
        pinch: null,
        rotate: null,
    }

    const PRESS_DELAY = 128;

    let pressCount = 0;
    let pressTimer = null;
    let countTouches = 0;
    let countMaxTouches = 0;
    let initialTouches = null;
    let currentTouches = null;
    let initialTime = null;
    let currentTime = null;

    let moveX = 0;
    let moveY = 0;

    function setPressTimer() {
        if (pressTimer) {
            clearInterval(pressTimer);
        }
        pressCount = 0;
        returnPress();
        pressTimer = setInterval(returnPress, PRESS_DELAY);
    }
    function unsetPressTimer() {
        if (pressTimer) {
            clearInterval(pressTimer);
        }
        pressTimer = null;
    }
    function returnStart() {
        if (callbacks.start) {
            callbacks.start({
                initialTime: initialTime,
                currentTime: currentTime,
            });
        }
    }
    function returnEnd() {
        if (callbacks.end) {
            callbacks.end({
                initialTime: initialTime,
                currentTime: currentTime,
            });
        }
    }
    function returnTap() {
        if (callbacks.tap) {
            callbacks.tap({
                initialX: initialTouches[0].pageX,
                initialY: initialTouches[0].pageY,
                currentX: currentTouches[0].pageX,
                currentY: currentTouches[0].pageY,
                moveX: moveX,
                moveY: moveY,
                initialTime: initialTime,
                currentTime: currentTime,
            });
        }
    }
    function returnPress() {
        if (callbacks.press) {
            currentTime = new Date().getTime();
            callbacks.press({
                initialX: initialTouches[0].pageX,
                initialY: initialTouches[0].pageY,
                currentX: currentTouches[0].pageX,
                currentY: currentTouches[0].pageY,
                moveX: moveX,
                moveY: moveY,
                initialTime: initialTime,
                currentTime: currentTime,
                count: pressCount++,
            });
        }
    }
    function returnSwipe() {
        if (callbacks.swipe) {
            moveX = currentTouches[0].pageX-initialTouches[0].pageX;
            moveY = currentTouches[0].pageY-initialTouches[0].pageY;
            callbacks.swipe({
                initialX: initialTouches[0].pageX,
                initialY: initialTouches[0].pageY,
                currentX: currentTouches[0].pageX,
                currentY: currentTouches[0].pageY,
                moveX: moveX,
                moveY: moveY,
                initialTime: initialTime,
                currentTime: currentTime,
            });
        }
    }
    function returnPinch() {
        if (callbacks.pinch) {
            moveX = currentTouches[0].pageX-initialTouches[0].pageX+currentTouches[1].pageX-initialTouches[1].pageX;
            moveY = currentTouches[0].pageY-initialTouches[0].pageY+currentTouches[1].pageY-initialTouches[1].pageY;
            const initialDistance = getDistance(
                initialTouches[0].pageX,
                initialTouches[0].pageY,
                initialTouches[1].pageX,
                initialTouches[1].pageY
            );
            const currentDistance = getDistance(
                currentTouches[0].pageX,
                currentTouches[0].pageY,
                currentTouches[1].pageX,
                currentTouches[1].pageY
            );
            callbacks.pinch({
                initialDistance: initialDistance,
                currentDistance: currentDistance,
                moveX: moveX,
                moveY: moveY,
                initialTime: initialTime,
                currentTime: currentTime,
            });
        }
    }
    function returnRotate() {
        if (callbacks.rotate) {
            const cx = (initialTouches[0].pageX+initialTouches[1].pageX)*0.5;
            const cy = (initialTouches[0].pageY+initialTouches[1].pageY)*0.5;
            const id1 = getDegree(cx, cy, initialTouches[0].pageX, initialTouches[0].pageY);
            const id2 = getDegree(cx, cy, initialTouches[1].pageX, initialTouches[1].pageY);
            const cd1 = getDegree(cx, cy, currentTouches[0].pageX, currentTouches[0].pageY);
            const cd2 = getDegree(cx, cy, currentTouches[1].pageX, currentTouches[1].pageY);
            const d1 = id1 - cd1;
            const d2 = id2 - cd2;
            const d = Math.max(d1, d2);
            callbacks.rotate({
                degree: setDegree(d),
                degree1: setDegree(d1),
                degree2: setDegree(d2),
                moveX: moveX,
                moveY: moveY,
                initialTime: initialTime,
                currentTime: currentTime,
            });
        }
    }
    return [
        PanResponder.create({
            onStartShouldSetPanResponder: function(e, gestureState) {
                return true;
            },
            onStartShouldSetPanResponderCapture: function(e, gestureState) {
                return true;
            },
            onMoveShouldSetPanResponder: function(e, gestureState) {
                return true;
            },
            onMoveShouldSetPanResponderCapture: function(e, gestureState) {
                return true;
            },
            onPanResponderGrant: function(e, gestureState) {
                initialTime = new Date().getTime();
                currentTime = initialTime;
                returnStart();
            },
            onPanResponderStart: function(e, gestureState) {
                const { touches } = e.nativeEvent;
                initialTouches = touches;
                currentTouches = touches;
                countTouches = touches.length;
                countMaxTouches = touches.length;
                currentTime = new Date().getTime();
                moveX = 0;
                moveY = 0;
                if (countTouches === 1) {
                    setPressTimer();
                } else {
                    unsetPressTimer();
                }
            },
            onPanResponderMove: function(e, gestureState) {
                const { touches } = e.nativeEvent;
                currentTouches = touches;
                countTouches = touches.length;
                currentTime = new Date().getTime();
                if (countTouches === 1) {
                    returnSwipe();
                } else if (countTouches === 2) {
                    returnPinch();
                    returnRotate();
                }
            },
            onPanResponderEnd: function(e, gestureState) {
                const { touches } = e.nativeEvent;
                unsetPressTimer(); // cancel press event
                currentTime = new Date().getTime();
                if (countMaxTouches === 1) {
                    returnTap();
                }
                initialTouches = touches;
                currentTouches = touches;
                countTouches = touches.length;
                moveX = 0;
                moveY = 0;
            },
            onPanResponderRelease: function(e, gestureState) {
                currentTime = new Date().getTime();
                returnEnd();
            },
            onPanResponderTerminationRequest: function(e, gestureState) {
                return true;
            },
        }),
        callbacks
    ];
}

export default useGesture;