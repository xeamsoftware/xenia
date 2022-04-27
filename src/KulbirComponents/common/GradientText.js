import React from 'react';
import {View, Text, Platform} from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import { getWidthnHeight, fontSizeH4 } from './width';

const GradientText = ({
    title = "Test", style = null, gradient = ["#039FFD", "#EA304F"]
}) => {
    const {linearStyle} = styles;
    return (
        <View>
            <LinearTextGradient
                style={[linearStyle, style]}
                useViewFrame={true}
                locations={[0, 1]}
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.7, y: 0 }}
            >
                <Text>{title}</Text>
            </LinearTextGradient>
        </View>
    );
};

const MaskedGradientText = (
    {
        start = {x: 0, y: 0}, end = {x: 0.15, y: 0},
        colors = ["#039FFD", "#EA304F"],
        title = "Gradient Text", titleStyle={color: '#000000', fontSize: (fontSizeH4().fontSize)}
    }
) => {
    return (
        <View>
            <MaskedView maskElement={<Text style={[{backgroundColor: 'transparent'}, titleStyle, styles.boldFont]}>{title}</Text>}>
                <LinearGradient 
                    start={start} end={end}
                    colors={colors}>
                        <Text style={[{opacity: 0}, titleStyle, styles.boldFont]}>{title}</Text>
                </LinearGradient>
            </MaskedView>
        </View>
    );
}

const styles = {
    linearStyle: { 
        fontWeight: "bold", 
        fontSize: 40,
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        ) 
    },
    boldFont: {
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        )
    }
};

export {GradientText, MaskedGradientText};