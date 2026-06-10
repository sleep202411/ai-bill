import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

cssInterop(LinearGradient, { className: 'style' });
cssInterop(Svg, { className: 'style' });
