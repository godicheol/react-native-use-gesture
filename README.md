```js
import useGesture from 'react-native-use-gesture';
```

```js
function App(props) {
    const [panResponder, gesture] = React.useRef(useGesture()).current;
    const [currentState, setCurrentState] = React.useState({
        x: 0,
        y: 0,
        scale: 0,
        rotate: 0
    });
    const [initialState, setInitialState] = React.useState({
        x: 0,
        y: 0,
        scale: 0,
        rotate: 0
    });

    gesture.start = function(e) {
        console.log("start", e);
        setInitialState(currentState);
    }
    gesture.end = function(e) {
        console.log("end", e);
    }
    gesture.tap = function(e) {
        if (pressCount < 1) {
            // < 128ms
            console.log("tap", e)
        }
    }
    gesture.press = function(e) {
        const {pressCount} = e;
        if (pressCount === 2) {
            // 256ms
            console.log("press", e);
        }
    }
    gesture.swipe = function(e) {
        console.log("swipe", e);
        const {moveX, moveY} = e;
        setCurrentState({
            ...currentState,
            x: initialState.x + moveX,
            y: initialState.y + moveY
        });
    }
    gesture.pinch = function(e) {
        console.log("pinch", e);
        const {initialDistance, currentDistance} = e;
        const distance = currentDistance - initialDistance;
        const scale = distance / 100;
        setCurrentState({
            ...currentState,
            scale: initialState.scale + scale
        });
    }
    gesture.rotate = function(e) {
        console.log("rotate", e);
    }

    return (
        <View
            style={{
                transform: [
                    {translateX: currentState.x},
                    {translateY: currentState.y},
                    {rotate: currentState.rotate + "deg"},
                    {scale: currentState.scale},
                ]
            }}
            {...panResponder.panHandlers}
            >
        </View>
    )
}
```