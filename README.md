```js
import useGesture from 'react-native-use-gesture';
```

```js
function App(props) {
    const [panResponder, gesture] = React.useRef(useGesture()).current;

    gesture.start = function(e) {
        console.log("start", e);
    }
    gesture.end = function(e) {
        console.log("end", e);
    }
    gesture.tap = function(e) {
        console.log("tap", e);
    }
    gesture.press = function(e) {
        console.log("press", e);
    }
    gesture.swipe = function(e) {
        console.log("swipe", e);
    }
    gesture.pinch = function(e) {
        console.log("pinch", e);
    }
    gesture.rotate = function(e) {
        console.log("rotate", e);
    }

    return (
        <View
            {...panResponder.panHandlers}
            >
        </View>
    )
}
```